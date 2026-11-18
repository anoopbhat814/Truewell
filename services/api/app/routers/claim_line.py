from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.claim_line import ClaimLineRepository
from app.schemas.claim_line import ClaimLineCreate, ClaimLineRead, ClaimLineUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/insurance/claim-lines", tags=["insurance/claim-lines"])


def get_service(session: Session = Depends(get_session)):
    repo = ClaimLineRepository(session)
    service = CrudService(repo)
    service.entity = "claim_line"
    service.patient_field = None
    return service


@router.get("", response_model=Page[ClaimLineRead])
def list_claim_lines(
    claim_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)),
    service=Depends(get_service),
) -> Page[ClaimLineRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, claim_id=claim_id)
    return Page(items=[ClaimLineRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=ClaimLineRead)
def get_claim_line(entity_id: str, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=ClaimLineRead, status_code=status.HTTP_201_CREATED)
def create_claim_line(payload: ClaimLineCreate, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=ClaimLineRead)
def update_claim_line(entity_id: str, payload: ClaimLineUpdate, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_claim_line(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
