from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.medication import MedicationRepository
from app.schemas.medication import MedicationCreate, MedicationRead, MedicationUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/medications", tags=["medications"])


def get_service(session: Session = Depends(get_session)):
    repo = MedicationRepository(session)
    service = CrudService(repo)
    service.entity = "medication"
    service.patient_field = None
    return service


@router.get("", response_model=Page[MedicationRead])
def list_medications(
    params: PageParams = Depends(),
    actor: Principal = Depends(require_roles(*STAFF)),
    service=Depends(get_service),
) -> Page[MedicationRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit)
    return Page(items=[MedicationRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=MedicationRead)
def get_medication(entity_id: str, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=MedicationRead, status_code=status.HTTP_201_CREATED)
def create_medication(payload: MedicationCreate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=MedicationRead)
def update_medication(entity_id: str, payload: MedicationUpdate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
