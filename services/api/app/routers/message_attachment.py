from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.message_attachment import MessageAttachmentRepository
from app.schemas.message_attachment import MessageAttachmentCreate, MessageAttachmentRead, MessageAttachmentUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/message-attachments", tags=["message-attachments"])


def get_service(session: Session = Depends(get_session)):
    repo = MessageAttachmentRepository(session)
    service = CrudService(repo)
    service.entity = "message_attachment"
    service.patient_field = None
    return service


@router.get("", response_model=Page[MessageAttachmentRead])
def list_message_attachments(
    message_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[MessageAttachmentRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, message_id=message_id)
    return Page(items=[MessageAttachmentRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=MessageAttachmentRead)
def get_message_attachment(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=MessageAttachmentRead, status_code=status.HTTP_201_CREATED)
def create_message_attachment(payload: MessageAttachmentCreate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=MessageAttachmentRead)
def update_message_attachment(entity_id: str, payload: MessageAttachmentUpdate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message_attachment(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
