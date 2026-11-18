from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.telehealth_participant import TelehealthParticipantRepository
from app.schemas.telehealth_participant import TelehealthParticipantCreate, TelehealthParticipantRead, TelehealthParticipantUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/telehealth/participants", tags=["telehealth/participants"])


def get_service(session: Session = Depends(get_session)):
    repo = TelehealthParticipantRepository(session)
    service = CrudService(repo)
    service.entity = "telehealth_participant"
    service.patient_field = None
    return service


@router.get("", response_model=Page[TelehealthParticipantRead])
def list_telehealth_participants(
    session_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(require_roles(*CARE_TEAM)),
    service=Depends(get_service),
) -> Page[TelehealthParticipantRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, session_id=session_id)
    return Page(items=[TelehealthParticipantRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=TelehealthParticipantRead)
def get_telehealth_participant(entity_id: str, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=TelehealthParticipantRead, status_code=status.HTTP_201_CREATED)
def create_telehealth_participant(payload: TelehealthParticipantCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=TelehealthParticipantRead)
def update_telehealth_participant(entity_id: str, payload: TelehealthParticipantUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_telehealth_participant(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
