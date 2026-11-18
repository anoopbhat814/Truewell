from datetime import date
from typing import Any

from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ConflictError, ValidationFailed
from app.models.patient import Patient
from app.services.crud import CrudService


def age_on(dob: date, today: date | None = None) -> int:
    today = today or utcnow().date()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


class PatientService(CrudService[Patient]):
    entity = "patient"
    patient_field = None

    def scope(self, actor: Principal) -> dict[str, Any]:
        # Patients may only ever enumerate themselves; clinicians see their panel via filters.
        return {"id": actor.patient_id or "__none__"} if actor.is_patient else {}

    def _check_access(self, actor: Principal, obj: Patient) -> None:
        if actor.is_patient and obj.id != actor.patient_id:
            from app.errors import ForbiddenError

            raise ForbiddenError("You do not have access to this record")

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        if data["date_of_birth"] > utcnow().date():
            raise ValidationFailed("Date of birth cannot be in the future")
        if self.session.query(Patient).filter(Patient.mrn == data["mrn"]).first():
            raise ConflictError(f"MRN {data['mrn']} is already registered")
        return data
