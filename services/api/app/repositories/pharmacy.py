from app.models.pharmacy import Pharmacy
from app.repositories.base import BaseRepository


class PharmacyRepository(BaseRepository[Pharmacy]):
    model = Pharmacy
    order_by = "id"

    def by_city(self, value, *, limit: int = 100) -> list[Pharmacy]:
        return self.list(limit=limit, **{"city": value})

    def by_region(self, value, *, limit: int = 100) -> list[Pharmacy]:
        return self.list(limit=limit, **{"region": value})
