from app.models.patient import Patient
from app.repositories.base import BaseRepository


class PatientRepository(BaseRepository[Patient]):
    model = Patient
    order_by = "id"

    def by_primary_clinician_id(self, value, *, limit: int = 100) -> list[Patient]:
        return self.list(limit=limit, **{"primary_clinician_id": value})
