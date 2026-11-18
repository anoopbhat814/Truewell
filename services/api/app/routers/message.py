from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.message import MessageRepository
from app.schemas.message import MessageCreate, MessageRead, MessageUpdate
from app.services.message import MessageService

router = APIRouter(prefix="/messages", tags=["messages"])


def get_service(session: Session = Depends(get_session)):
    repo = MessageRepository(session)
    return MessageService(repo)


@router.get("", response_model=Page[MessageRead])
def list_messages(
    thread_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[MessageRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, thread_id=thread_id)
    return Page(items=[MessageRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=MessageRead)
def get_message(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
def create_message(payload: MessageCreate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=MessageRead)
def update_message(entity_id: str, payload: MessageUpdate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)


@router.post("/{entity_id}/read", response_model=MessageRead)
def mark_message_read(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.mark_read(entity_id, actor)
