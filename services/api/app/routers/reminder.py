from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.reminder import ReminderRepository
from app.schemas.reminder import ReminderCreate, ReminderRead, ReminderUpdate
from app.services.reminder import ReminderService

router = APIRouter(prefix="/reminders", tags=["reminders"])


def get_service(session: Session = Depends(get_session)):
    repo = ReminderRepository(session)
    return ReminderService(repo)


@router.get("", response_model=Page[ReminderRead])
def list_reminders(
    status: str | None = None,
    channel: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[ReminderRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, status=status, channel=channel)
    return Page(items=[ReminderRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=ReminderRead)
def get_reminder(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=ReminderRead, status_code=status.HTTP_201_CREATED)
def create_reminder(payload: ReminderCreate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=ReminderRead)
def update_reminder(entity_id: str, payload: ReminderUpdate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
