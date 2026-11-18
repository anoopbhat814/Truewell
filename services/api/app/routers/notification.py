from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.notification import NotificationRepository
from app.schemas.notification import NotificationCreate, NotificationRead, NotificationUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_service(session: Session = Depends(get_session)):
    repo = NotificationRepository(session)
    service = CrudService(repo)
    service.entity = "notification"
    service.patient_field = None
    return service


@router.get("", response_model=Page[NotificationRead])
def list_notifications(
    user_id: str | None = None,
    kind: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[NotificationRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, user_id=user_id, kind=kind)
    return Page(items=[NotificationRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=NotificationRead)
def get_notification(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=NotificationRead, status_code=status.HTTP_201_CREATED)
def create_notification(payload: NotificationCreate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=NotificationRead)
def update_notification(entity_id: str, payload: NotificationUpdate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
