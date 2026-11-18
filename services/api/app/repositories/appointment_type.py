from app.models.appointment_type import AppointmentType
from app.repositories.base import BaseRepository


class AppointmentTypeRepository(BaseRepository[AppointmentType]):
    model = AppointmentType
    order_by = "id"
