from app.models.document import Document
from app.repositories.base import BaseRepository


class DocumentRepository(BaseRepository[Document]):
    model = Document
    order_by = "id"

    def by_category(self, value, *, limit: int = 100) -> list[Document]:
        return self.list(limit=limit, **{"category": value})
