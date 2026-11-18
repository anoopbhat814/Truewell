from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.claim import ClaimRepository
from app.schemas.claim import ClaimCreate, ClaimRead, ClaimUpdate
from app.services.claim import ClaimService

router = APIRouter(prefix="/insurance/claims", tags=["insurance/claims"])


def get_service(session: Session = Depends(get_session)):
    repo = ClaimRepository(session)
    return ClaimService(repo)


@router.get("", response_model=Page[ClaimRead])
def list_claims(
    status: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN, Role.PATIENT)),
    service=Depends(get_service),
) -> Page[ClaimRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, status=status)
    return Page(items=[ClaimRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=ClaimRead)
def get_claim(entity_id: str, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN, Role.PATIENT)), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=ClaimRead, status_code=status.HTTP_201_CREATED)
def create_claim(payload: ClaimCreate, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=ClaimRead)
def update_claim(entity_id: str, payload: ClaimUpdate, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_claim(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)


class AdjudicationIn(BaseModel):
    allowed_cents: int = Field(ge=0)
    denial_code: str | None = None


@router.post("/{entity_id}/submit", response_model=ClaimRead)
def submit_claim(entity_id: str, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.submit(entity_id, actor)


@router.post("/{entity_id}/adjudicate", response_model=ClaimRead)
def adjudicate_claim(entity_id: str, body: AdjudicationIn, actor: Principal = Depends(require_roles(Role.BILLING, Role.ADMIN)), service=Depends(get_service)):
    return service.adjudicate(entity_id, actor, allowed_cents=body.allowed_cents, denial_code=body.denial_code)
