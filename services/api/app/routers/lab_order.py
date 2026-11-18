from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.lab_order import LabOrderRepository
from app.schemas.lab_order import LabOrderCreate, LabOrderRead, LabOrderUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/lab-orders", tags=["lab-orders"])


def get_service(session: Session = Depends(get_session)):
    repo = LabOrderRepository(session)
    service = CrudService(repo)
    service.entity = "lab_order"
    service.patient_field = 'patient_id'
    return service


@router.get("", response_model=Page[LabOrderRead])
def list_lab_orders(
    status: str | None = None,
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[LabOrderRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit, status=status)
    return Page(items=[LabOrderRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=LabOrderRead)
def get_lab_order(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=LabOrderRead, status_code=status.HTTP_201_CREATED)
def create_lab_order(payload: LabOrderCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=LabOrderRead)
def update_lab_order(entity_id: str, payload: LabOrderUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab_order(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
