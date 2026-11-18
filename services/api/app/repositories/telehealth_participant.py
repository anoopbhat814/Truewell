from app.models.telehealth_participant import TelehealthParticipant
from app.repositories.base import BaseRepository


class TelehealthParticipantRepository(BaseRepository[TelehealthParticipant]):
    model = TelehealthParticipant
    order_by = "id"

    def by_session_id(self, value, *, limit: int = 100) -> list[TelehealthParticipant]:
        return self.list(limit=limit, **{"session_id": value})
