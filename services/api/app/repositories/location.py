from app.models.location import Location
from app.repositories.base import BaseRepository


class LocationRepository(BaseRepository[Location]):
    model = Location
    order_by = "id"

    def by_organization_id(self, value, *, limit: int = 100) -> list[Location]:
        return self.list(limit=limit, **{"organization_id": value})
