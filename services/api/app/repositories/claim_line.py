from app.models.claim_line import ClaimLine
from app.repositories.base import BaseRepository


class ClaimLineRepository(BaseRepository[ClaimLine]):
    model = ClaimLine
    order_by = "id"

    def by_claim_id(self, value, *, limit: int = 100) -> list[ClaimLine]:
        return self.list(limit=limit, **{"claim_id": value})
