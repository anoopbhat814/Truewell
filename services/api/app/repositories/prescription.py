from app.models.prescription import Prescription
from app.repositories.base import BaseRepository


class PrescriptionRepository(BaseRepository[Prescription]):
    model = Prescription
    order_by = "id"

    def by_status(self, value, *, limit: int = 100) -> list[Prescription]:
        return self.list(limit=limit, **{"status": value})

    def by_clinician_id(self, value, *, limit: int = 100) -> list[Prescription]:
        return self.list(limit=limit, **{"clinician_id": value})
