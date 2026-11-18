from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.document import DocumentRepository
from app.schemas.document import DocumentCreate, DocumentRead, DocumentUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/documents", tags=["documents"])


def get_service(session: Session = Depends(get_session)):
    repo = DocumentRepository(session)
    service = CrudService(repo)
    service.entity = "document"
    service.patient_field = 'patient_id'
    return service


@router.get("", response_model=Page[DocumentRead])
def list_documents(
    category: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[DocumentRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, category=category)
    return Page(items=[DocumentRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=DocumentRead)
def get_document(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
def create_document(payload: DocumentCreate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=DocumentRead)
def update_document(entity_id: str, payload: DocumentUpdate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
