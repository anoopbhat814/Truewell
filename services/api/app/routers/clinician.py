from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.clinician import ClinicianRepository
from app.schemas.clinician import ClinicianCreate, ClinicianRead, ClinicianUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/clinicians", tags=["clinicians"])


def get_service(session: Session = Depends(get_session)):
    repo = ClinicianRepository(session)
    service = CrudService(repo)
    service.entity = "clinician"
    service.patient_field = None
    return service


@router.get("", response_model=Page[ClinicianRead])
def list_clinicians(
    specialty: str | None = None,
    organization_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[ClinicianRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, specialty=specialty, organization_id=organization_id)
    return Page(items=[ClinicianRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=ClinicianRead)
def get_clinician(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=ClinicianRead, status_code=status.HTTP_201_CREATED)
def create_clinician(payload: ClinicianCreate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=ClinicianRead)
def update_clinician(entity_id: str, payload: ClinicianUpdate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clinician(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
