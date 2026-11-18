from app.models.appointment import Appointment
from app.repositories.base import BaseRepository


class AppointmentRepository(BaseRepository[Appointment]):
    model = Appointment
    order_by = "starts_at"

    def by_clinician_id(self, value, *, limit: int = 100) -> list[Appointment]:
        return self.list(limit=limit, **{"clinician_id": value})

    def by_status(self, value, *, limit: int = 100) -> list[Appointment]:
        return self.list(limit=limit, **{"status": value})
