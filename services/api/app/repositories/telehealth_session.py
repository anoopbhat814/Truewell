from app.models.telehealth_session import TelehealthSession
from app.repositories.base import BaseRepository


class TelehealthSessionRepository(BaseRepository[TelehealthSession]):
    model = TelehealthSession
    order_by = "id"

    def by_status(self, value, *, limit: int = 100) -> list[TelehealthSession]:
        return self.list(limit=limit, **{"status": value})
