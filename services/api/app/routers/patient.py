from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.patient import PatientRepository
from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate
from app.services.patient import PatientService

router = APIRouter(prefix="/patients", tags=["patients"])


def get_service(session: Session = Depends(get_session)):
    repo = PatientRepository(session)
    return PatientService(repo)


@router.get("", response_model=Page[PatientRead])
def list_patients(
    primary_clinician_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(require_roles(*STAFF)),
    service=Depends(get_service),
) -> Page[PatientRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, primary_clinician_id=primary_clinician_id)
    return Page(items=[PatientRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=PatientRead)
def get_patient(entity_id: str, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=PatientRead, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=PatientRead)
def update_patient(entity_id: str, payload: PatientUpdate, actor: Principal = Depends(require_roles(*STAFF)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
