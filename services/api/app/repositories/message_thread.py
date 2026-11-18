from app.models.message_thread import MessageThread
from app.repositories.base import BaseRepository


class MessageThreadRepository(BaseRepository[MessageThread]):
    model = MessageThread
    order_by = "last_message_at"

    def by_clinician_id(self, value, *, limit: int = 100) -> list[MessageThread]:
        return self.list(limit=limit, **{"clinician_id": value})

    def by_archived(self, value, *, limit: int = 100) -> list[MessageThread]:
        return self.list(limit=limit, **{"archived": value})
