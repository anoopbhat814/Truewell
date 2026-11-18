from app.models.clinician import Clinician
from app.repositories.base import BaseRepository


class ClinicianRepository(BaseRepository[Clinician]):
    model = Clinician
    order_by = "id"

    def by_specialty(self, value, *, limit: int = 100) -> list[Clinician]:
        return self.list(limit=limit, **{"specialty": value})

    def by_organization_id(self, value, *, limit: int = 100) -> list[Clinician]:
        return self.list(limit=limit, **{"organization_id": value})
