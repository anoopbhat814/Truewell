from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.care_plan import CarePlanRepository
from app.schemas.care_plan import CarePlanCreate, CarePlanRead, CarePlanUpdate
from app.services.care_plan import CarePlanService

router = APIRouter(prefix="/care-plans", tags=["care-plans"])


def get_service(session: Session = Depends(get_session)):
    repo = CarePlanRepository(session)
    return CarePlanService(repo)


@router.get("", response_model=Page[CarePlanRead])
def list_care_plans(
    status: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[CarePlanRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, status=status)
    return Page(items=[CarePlanRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=CarePlanRead)
def get_care_plan(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=CarePlanRead, status_code=status.HTTP_201_CREATED)
def create_care_plan(payload: CarePlanCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=CarePlanRead)
def update_care_plan(entity_id: str, payload: CarePlanUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_care_plan(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)


@router.get("/{entity_id}/progress")
def care_plan_progress(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)) -> dict:
    return service.progress(entity_id, actor)
