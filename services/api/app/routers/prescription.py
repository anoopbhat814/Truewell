from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.prescription import PrescriptionRepository
from app.schemas.prescription import PrescriptionCreate, PrescriptionRead, PrescriptionUpdate
from app.services.prescription import PrescriptionService

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])


def get_service(session: Session = Depends(get_session)):
    repo = PrescriptionRepository(session)
    return PrescriptionService(repo)


@router.get("", response_model=Page[PrescriptionRead])
def list_prescriptions(
    status: str | None = None,
    clinician_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[PrescriptionRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, status=status, clinician_id=clinician_id)
    return Page(items=[PrescriptionRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=PrescriptionRead)
def get_prescription(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=PrescriptionRead, status_code=status.HTTP_201_CREATED)
def create_prescription(payload: PrescriptionCreate, actor: Principal = Depends(require_roles(Role.CLINICIAN, Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=PrescriptionRead)
def update_prescription(entity_id: str, payload: PrescriptionUpdate, actor: Principal = Depends(require_roles(Role.CLINICIAN, Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prescription(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)


@router.post("/{entity_id}/send", response_model=PrescriptionRead)
def send_prescription(entity_id: str, actor: Principal = Depends(require_roles(Role.CLINICIAN)), service=Depends(get_service)):
    return service.send(entity_id, actor)


@router.post("/{entity_id}/cancel", response_model=PrescriptionRead)
def cancel_prescription(entity_id: str, actor: Principal = Depends(require_roles(Role.CLINICIAN, Role.ADMIN)), service=Depends(get_service)):
    return service.cancel(entity_id, actor)
