from app.models.claim import Claim
from app.repositories.base import BaseRepository


class ClaimRepository(BaseRepository[Claim]):
    model = Claim
    order_by = "id"

    def by_status(self, value, *, limit: int = 100) -> list[Claim]:
        return self.list(limit=limit, **{"status": value})
