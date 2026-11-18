from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.appointment_type import AppointmentTypeRepository
from app.schemas.appointment_type import AppointmentTypeCreate, AppointmentTypeRead, AppointmentTypeUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/appointment-types", tags=["appointment-types"])


def get_service(session: Session = Depends(get_session)):
    repo = AppointmentTypeRepository(session)
    service = CrudService(repo)
    service.entity = "appointment_type"
    service.patient_field = None
    return service


@router.get("", response_model=Page[AppointmentTypeRead])
def list_appointment_types(
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[AppointmentTypeRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit)
    return Page(items=[AppointmentTypeRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=AppointmentTypeRead)
def get_appointment_type(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=AppointmentTypeRead, status_code=status.HTTP_201_CREATED)
def create_appointment_type(payload: AppointmentTypeCreate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=AppointmentTypeRead)
def update_appointment_type(entity_id: str, payload: AppointmentTypeUpdate, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment_type(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
