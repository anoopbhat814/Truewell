from app.models.allergy import Allergy
from app.repositories.base import BaseRepository


class AllergyRepository(BaseRepository[Allergy]):
    model = Allergy
    order_by = "id"
