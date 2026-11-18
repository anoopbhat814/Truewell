from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.message_thread import MessageThreadRepository
from app.schemas.message_thread import MessageThreadCreate, MessageThreadRead, MessageThreadUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/message-threads", tags=["message-threads"])


def get_service(session: Session = Depends(get_session)):
    repo = MessageThreadRepository(session)
    service = CrudService(repo)
    service.entity = "message_thread"
    service.patient_field = 'patient_id'
    return service


@router.get("", response_model=Page[MessageThreadRead])
def list_message_threads(
    clinician_id: str | None = None,
    archived: bool | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[MessageThreadRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, clinician_id=clinician_id, archived=archived)
    return Page(items=[MessageThreadRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=MessageThreadRead)
def get_message_thread(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=MessageThreadRead, status_code=status.HTTP_201_CREATED)
def create_message_thread(payload: MessageThreadCreate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=MessageThreadRead)
def update_message_thread(entity_id: str, payload: MessageThreadUpdate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message_thread(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
