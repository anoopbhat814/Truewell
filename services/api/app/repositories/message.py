from app.models.message import Message
from app.repositories.base import BaseRepository


class MessageRepository(BaseRepository[Message]):
    model = Message
    order_by = "sent_at"

    def by_thread_id(self, value, *, limit: int = 100) -> list[Message]:
        return self.list(limit=limit, **{"thread_id": value})
