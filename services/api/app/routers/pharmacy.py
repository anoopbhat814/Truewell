from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.pharmacy import PharmacyRepository
from app.schemas.pharmacy import PharmacyCreate, PharmacyRead, PharmacyUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/pharmacies", tags=["pharmacies"])


def get_service(session: Session = Depends(get_session)):
    repo = PharmacyRepository(session)
    service = CrudService(repo)
    service.entity = "pharmacy"
    service.patient_field = None
    return service


@router.get("", response_model=Page[PharmacyRead])
def list_pharmacies(
    city: str | None = None,
    region: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[PharmacyRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, city=city, region=region)
    return Page(items=[PharmacyRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=PharmacyRead)
def get_pharmacy(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=PharmacyRead, status_code=status.HTTP_201_CREATED)
def create_pharmacy(payload: PharmacyCreate, actor: Principal = Depends(require_roles(Role.ADMIN, Role.FRONT_DESK)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=PharmacyRead)
def update_pharmacy(entity_id: str, payload: PharmacyUpdate, actor: Principal = Depends(require_roles(Role.ADMIN, Role.FRONT_DESK)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pharmacy(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
