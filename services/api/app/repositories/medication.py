from app.models.medication import Medication
from app.repositories.base import BaseRepository


class MedicationRepository(BaseRepository[Medication]):
    model = Medication
    order_by = "id"
