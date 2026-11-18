from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.availability_slot import AvailabilitySlotRepository
from app.schemas.availability_slot import AvailabilitySlotCreate, AvailabilitySlotRead, AvailabilitySlotUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/availability", tags=["availability"])


def get_service(session: Session = Depends(get_session)):
    repo = AvailabilitySlotRepository(session)
    service = CrudService(repo)
    service.entity = "availability_slot"
    service.patient_field = None
    return service


@router.get("", response_model=Page[AvailabilitySlotRead])
def list_availability_slots(
    clinician_id: str | None = None,
    is_booked: bool | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[AvailabilitySlotRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, clinician_id=clinician_id, is_booked=is_booked)
    return Page(items=[AvailabilitySlotRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=AvailabilitySlotRead)
def get_availability_slot(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=AvailabilitySlotRead, status_code=status.HTTP_201_CREATED)
def create_availability_slot(payload: AvailabilitySlotCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=AvailabilitySlotRead)
def update_availability_slot(entity_id: str, payload: AvailabilitySlotUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability_slot(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
