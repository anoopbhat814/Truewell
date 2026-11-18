from app.models.availability_slot import AvailabilitySlot
from app.repositories.base import BaseRepository


class AvailabilitySlotRepository(BaseRepository[AvailabilitySlot]):
    model = AvailabilitySlot
    order_by = "starts_at"

    def by_clinician_id(self, value, *, limit: int = 100) -> list[AvailabilitySlot]:
        return self.list(limit=limit, **{"clinician_id": value})

    def by_is_booked(self, value, *, limit: int = 100) -> list[AvailabilitySlot]:
        return self.list(limit=limit, **{"is_booked": value})
