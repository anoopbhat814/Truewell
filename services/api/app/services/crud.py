from typing import Any, Generic, TypeVar

from pydantic import BaseModel

from app import audit
from app.core.rbac import Principal
from app.errors import ForbiddenError, NotFoundError
from app.repositories.base import BaseRepository

ModelT = TypeVar("ModelT")


class CrudService(Generic[ModelT]):
    """Generic service providing audited CRUD with patient-level row scoping.

    Domain services subclass this and override the ``before_*`` / ``after_*`` hooks to
    enforce business rules without re-implementing persistence or auditing.
    """

    entity: str = "entity"
    patient_field: str | None = "patient_id"

    def __init__(self, repo: BaseRepository[ModelT]) -> None:
        self.repo = repo
        self.session = repo.session

    # -- scoping -----------------------------------------------------------------
    def scope(self, actor: Principal) -> dict[str, Any]:
        if actor.is_patient and self.patient_field:
            return {self.patient_field: actor.patient_id or "__none__"}
        return {}

    def _check_access(self, actor: Principal, obj: ModelT) -> None:
        if actor.is_patient and self.patient_field:
            if getattr(obj, self.patient_field, None) != actor.patient_id:
                raise ForbiddenError("You do not have access to this record")

    # -- hooks ---------------------------------------------------------------------
    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        if actor.is_patient and self.patient_field and self.patient_field in self.repo.model.__table__.c:
            data[self.patient_field] = actor.patient_id
        return data

    def after_create(self, obj: ModelT, actor: Principal) -> None:
        return None

    def before_update(self, obj: ModelT, changes: dict[str, Any], actor: Principal) -> dict[str, Any]:
        return changes

    # -- operations ----------------------------------------------------------------
    def get(self, entity_id: str, actor: Principal) -> ModelT:
        obj = self.repo.get(entity_id)
        if obj is None:
            raise NotFoundError(f"{self.entity} {entity_id} not found")
        self._check_access(actor, obj)
        audit.record(self.session, actor, "read", self.entity, entity_id)
        return obj

    def list(self, actor: Principal, *, offset: int, limit: int, **filters: Any) -> tuple[list[ModelT], int]:
        merged = {**filters, **self.scope(actor)}
        items = self.repo.list(offset=offset, limit=limit, **merged)
        return items, self.repo.count(**merged)

    def create(self, payload: BaseModel, actor: Principal) -> ModelT:
        data = self.before_create(payload.model_dump(), actor)
        obj = self.repo.add(self.repo.model(**data))
        audit.record(self.session, actor, "create", self.entity, obj.id)
        self.after_create(obj, actor)
        return obj

    def update(self, entity_id: str, payload: BaseModel, actor: Principal) -> ModelT:
        obj = self.get(entity_id, actor)
        changes = self.before_update(obj, payload.model_dump(exclude_unset=True), actor)
        self.repo.update(obj, changes)
        audit.record(self.session, actor, "update", self.entity, entity_id, {"fields": sorted(changes)})
        return obj

    def delete(self, entity_id: str, actor: Principal) -> None:
        obj = self.get(entity_id, actor)
        self.repo.delete(obj)
        audit.record(self.session, actor, "delete", self.entity, entity_id)
