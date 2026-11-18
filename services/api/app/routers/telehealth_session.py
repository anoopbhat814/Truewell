from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.telehealth_session import TelehealthSessionRepository
from app.schemas.telehealth_session import TelehealthSessionCreate, TelehealthSessionRead, TelehealthSessionUpdate
from app.services.telehealth_session import TelehealthService

router = APIRouter(prefix="/telehealth/sessions", tags=["telehealth/sessions"])


def get_service(session: Session = Depends(get_session)):
    repo = TelehealthSessionRepository(session)
    return TelehealthService(repo)


@router.get("", response_model=Page[TelehealthSessionRead])
def list_telehealth_sessions(
    status: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[TelehealthSessionRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, status=status)
    return Page(items=[TelehealthSessionRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=TelehealthSessionRead)
def get_telehealth_session(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=TelehealthSessionRead, status_code=status.HTTP_201_CREATED)
def create_telehealth_session(payload: TelehealthSessionCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=TelehealthSessionRead)
def update_telehealth_session(entity_id: str, payload: TelehealthSessionUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_telehealth_session(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)


@router.post("/{entity_id}/join")
def join_session(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)) -> dict:
    """Issue a short-lived signed token for the video provider."""
    return service.join(entity_id, actor)


@router.post("/{entity_id}/end", response_model=TelehealthSessionRead)
def end_session(entity_id: str, actor: Principal = Depends(require_roles(Role.CLINICIAN, Role.ADMIN)), service=Depends(get_service)):
    return service.end(entity_id, actor)
