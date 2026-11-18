from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.lab_result import LabResultRepository
from app.schemas.lab_result import LabResultCreate, LabResultRead, LabResultUpdate
from app.services.lab_result import LabResultService

router = APIRouter(prefix="/lab-results", tags=["lab-results"])


def get_service(session: Session = Depends(get_session)):
    repo = LabResultRepository(session)
    return LabResultService(repo)


@router.get("", response_model=Page[LabResultRead])
def list_lab_results(
    order_id: str | None = None,
    flag: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[LabResultRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, order_id=order_id, flag=flag)
    return Page(items=[LabResultRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=LabResultRead)
def get_lab_result(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=LabResultRead, status_code=status.HTTP_201_CREATED)
def create_lab_result(payload: LabResultCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=LabResultRead)
def update_lab_result(entity_id: str, payload: LabResultUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab_result(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
