from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.appointment import AppointmentRepository
from app.schemas.appointment import AppointmentCreate, AppointmentRead, AppointmentUpdate
from app.services.appointment import AppointmentService

router = APIRouter(prefix="/appointments", tags=["appointments"])


def get_service(session: Session = Depends(get_session)):
    repo = AppointmentRepository(session)
    return AppointmentService(repo)


@router.get("", response_model=Page[AppointmentRead])
def list_appointments(
    clinician_id: str | None = None,
    status: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[AppointmentRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, clinician_id=clinician_id, status=status)
    return Page(items=[AppointmentRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=AppointmentRead)
def get_appointment(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=AppointmentRead)
def update_appointment(entity_id: str, payload: AppointmentUpdate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
