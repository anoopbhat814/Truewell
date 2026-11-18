from app.models.reminder import Reminder
from app.repositories.base import BaseRepository


class ReminderRepository(BaseRepository[Reminder]):
    model = Reminder
    order_by = "send_at"

    def by_status(self, value, *, limit: int = 100) -> list[Reminder]:
        return self.list(limit=limit, **{"status": value})

    def by_channel(self, value, *, limit: int = 100) -> list[Reminder]:
        return self.list(limit=limit, **{"channel": value})
