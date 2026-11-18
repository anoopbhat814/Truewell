from datetime import timedelta
from typing import Any

from sqlalchemy import select

from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ConflictError, ValidationFailed
from app.models.allergy import Allergy
from app.models.medication import Medication
from app.models.prescription import Prescription
from app.services.crud import CrudService
from app.services.interactions import conflicts_with_allergy, find_interactions

CONTROLLED_MAX_REFILLS = 0
STANDARD_VALIDITY = timedelta(days=365)
CONTROLLED_VALIDITY = timedelta(days=30)


class PrescriptionService(CrudService[Prescription]):
    entity = "prescription"

    def _active_drug_names(self, patient_id: str) -> list[str]:
        stmt = (
            select(Medication.name)
            .join(Prescription, Prescription.medication_id == Medication.id)
            .where(Prescription.patient_id == patient_id, Prescription.status.in_(["SENT", "FILLED"]))
        )
        return list(self.session.scalars(stmt))

    def check_safety(self, patient_id: str, medication: Medication) -> dict[str, Any]:
        allergies = list(self.session.scalars(select(Allergy.substance).where(Allergy.patient_id == patient_id)))
        return {
            "interactions": find_interactions(medication.name, self._active_drug_names(patient_id)),
            "allergy_conflict": conflicts_with_allergy(medication.name, allergies),
        }

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        med = self.session.get(Medication, data["medication_id"])
        if med is None:
            raise ValidationFailed("Unknown medication")
        if data["quantity"] <= 0:
            raise ValidationFailed("Quantity must be positive")
        if med.is_controlled and data["refills"] > CONTROLLED_MAX_REFILLS:
            raise ValidationFailed("Controlled substances cannot carry refills")
        safety = self.check_safety(data["patient_id"], med)
        if safety["allergy_conflict"]:
            raise ConflictError("Patient has a recorded allergy to this medication")
        if any(i["severity"] == "major" for i in safety["interactions"]):
            raise ConflictError("Major drug interaction detected", details={"interactions": safety["interactions"]})
        return data

    def send(self, prescription_id: str, actor: Principal) -> Prescription:
        rx = self.get(prescription_id, actor)
        if rx.status != "DRAFT":
            raise ConflictError("Only draft prescriptions can be sent")
        if rx.pharmacy_id is None:
            raise ValidationFailed("Choose a pharmacy before sending")
        med = self.session.get(Medication, rx.medication_id)
        now = utcnow()
        rx.status = "SENT"
        rx.issued_at = now
        rx.expires_at = now + (CONTROLLED_VALIDITY if med and med.is_controlled else STANDARD_VALIDITY)
        self.session.flush()
        return rx

    def cancel(self, prescription_id: str, actor: Principal) -> Prescription:
        rx = self.get(prescription_id, actor)
        if rx.status in {"FILLED", "CANCELLED", "EXPIRED"}:
            raise ConflictError(f"A {rx.status.lower()} prescription cannot be cancelled")
        rx.status = "CANCELLED"
        self.session.flush()
        return rx
