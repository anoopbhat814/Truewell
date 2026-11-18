from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.organization import OrganizationRepository
from app.schemas.organization import OrganizationCreate, OrganizationRead, OrganizationUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/organizations", tags=["organizations"])


def get_service(session: Session = Depends(get_session)):
    repo = OrganizationRepository(session)
    service = CrudService(repo)
    service.entity = "organization"
    service.patient_field = None
    return service


@router.get("", response_model=Page[OrganizationRead])
def list_organizations(
    params: PageParams = Depends(),
    actor: Principal = Depends(require_roles(*STAFF)),
    service=Depends(get_service),
) -> Page[OrganizationRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit)
    return Page(items=[OrganizationRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=OrganizationRead)
def get_organization(entity_id: str, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=OrganizationRead, status_code=status.HTTP_201_CREATED)
def create_organization(payload: OrganizationCreate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=OrganizationRead)
def update_organization(entity_id: str, payload: OrganizationUpdate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
