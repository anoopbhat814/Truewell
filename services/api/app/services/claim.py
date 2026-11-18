from typing import Any

from sqlalchemy import func, select

from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ConflictError, ValidationFailed
from app.models.claim import Claim
from app.models.claim_line import ClaimLine
from app.models.insurance_policy import InsurancePolicy
from app.services.crud import CrudService

CLAIM_TRANSITIONS = {
    "DRAFT": {"SUBMITTED"},
    "SUBMITTED": {"ACCEPTED", "DENIED"},
    "ACCEPTED": {"PAID", "DENIED"},
    "DENIED": {"APPEALED"},
    "APPEALED": {"ACCEPTED", "DENIED"},
    "PAID": set(),
}


def patient_responsibility(allowed_cents: int, copay_cents: int, deductible_remaining: int, coinsurance: float = 0.2) -> int:
    """Estimate what the patient owes: copay, then remaining deductible, then coinsurance on the rest."""
    owed = min(copay_cents, allowed_cents)
    remaining = allowed_cents - owed
    from_deductible = min(deductible_remaining, remaining)
    remaining -= from_deductible
    return owed + from_deductible + round(remaining * coinsurance)


class ClaimService(CrudService[Claim]):
    entity = "claim"

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        policy = self.session.get(InsurancePolicy, data["policy_id"])
        if policy is None or policy.patient_id != data["patient_id"]:
            raise ValidationFailed("Policy does not belong to this patient")
        if policy.terminates_on and policy.terminates_on < utcnow().date():
            raise ConflictError("Insurance policy has terminated")
        return data

    def recalculate_total(self, claim_id: str) -> int:
        stmt = select(func.coalesce(func.sum(ClaimLine.charge_cents * ClaimLine.units), 0)).where(ClaimLine.claim_id == claim_id)
        total = int(self.session.scalar(stmt) or 0)
        claim = self.repo.get(claim_id)
        if claim is not None:
            claim.total_cents = total
        return total

    def submit(self, claim_id: str, actor: Principal) -> Claim:
        claim = self.get(claim_id, actor)
        if "SUBMITTED" not in CLAIM_TRANSITIONS[claim.status]:
            raise ConflictError(f"A {claim.status.lower()} claim cannot be submitted")
        if self.recalculate_total(claim_id) <= 0:
            raise ValidationFailed("A claim needs at least one billable line")
        claim.status = "SUBMITTED"
        claim.submitted_at = utcnow()
        self.session.flush()
        return claim

    def adjudicate(self, claim_id: str, actor: Principal, *, allowed_cents: int, denial_code: str | None = None) -> Claim:
        claim = self.get(claim_id, actor)
        target = "DENIED" if denial_code else "ACCEPTED"
        if target not in CLAIM_TRANSITIONS[claim.status]:
            raise ConflictError(f"Cannot adjudicate a {claim.status.lower()} claim")
        claim.status = target
        claim.denial_code = denial_code
        claim.allowed_cents = None if denial_code else min(allowed_cents, claim.total_cents)
        claim.adjudicated_at = utcnow()
        self.session.flush()
        return claim
