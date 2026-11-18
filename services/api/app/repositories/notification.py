from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    model = Notification
    order_by = "id"

    def by_user_id(self, value, *, limit: int = 100) -> list[Notification]:
        return self.list(limit=limit, **{"user_id": value})

    def by_kind(self, value, *, limit: int = 100) -> list[Notification]:
        return self.list(limit=limit, **{"kind": value})
