from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.care_plan_task import CarePlanTaskRepository
from app.schemas.care_plan_task import CarePlanTaskCreate, CarePlanTaskRead, CarePlanTaskUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/care-plan-tasks", tags=["care-plan-tasks"])


def get_service(session: Session = Depends(get_session)):
    repo = CarePlanTaskRepository(session)
    service = CrudService(repo)
    service.entity = "care_plan_task"
    service.patient_field = None
    return service


@router.get("", response_model=Page[CarePlanTaskRead])
def list_care_plan_tasks(
    care_plan_id: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[CarePlanTaskRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, care_plan_id=care_plan_id)
    return Page(items=[CarePlanTaskRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=CarePlanTaskRead)
def get_care_plan_task(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=CarePlanTaskRead, status_code=status.HTTP_201_CREATED)
def create_care_plan_task(payload: CarePlanTaskCreate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=CarePlanTaskRead)
def update_care_plan_task(entity_id: str, payload: CarePlanTaskUpdate, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_care_plan_task(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
