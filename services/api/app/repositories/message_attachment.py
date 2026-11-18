from app.models.message_attachment import MessageAttachment
from app.repositories.base import BaseRepository


class MessageAttachmentRepository(BaseRepository[MessageAttachment]):
    model = MessageAttachment
    order_by = "id"

    def by_message_id(self, value, *, limit: int = 100) -> list[MessageAttachment]:
        return self.list(limit=limit, **{"message_id": value})
