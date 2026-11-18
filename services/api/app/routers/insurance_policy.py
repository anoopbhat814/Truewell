from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.insurance_policy import InsurancePolicyRepository
from app.schemas.insurance_policy import InsurancePolicyCreate, InsurancePolicyRead, InsurancePolicyUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/insurance/policies", tags=["insurance/policies"])


def get_service(session: Session = Depends(get_session)):
    repo = InsurancePolicyRepository(session)
    service = CrudService(repo)
    service.entity = "insurance_policy"
    service.patient_field = 'patient_id'
    return service


@router.get("", response_model=Page[InsurancePolicyRead])
def list_insurance_policies(
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[InsurancePolicyRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit)
    return Page(items=[InsurancePolicyRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=InsurancePolicyRead)
def get_insurance_policy(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=InsurancePolicyRead, status_code=status.HTTP_201_CREATED)
def create_insurance_policy(payload: InsurancePolicyCreate, actor: Principal = Depends(require_roles(Role.BILLING, Role.FRONT_DESK, Role.ADMIN)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=InsurancePolicyRead)
def update_insurance_policy(entity_id: str, payload: InsurancePolicyUpdate, actor: Principal = Depends(require_roles(Role.BILLING, Role.FRONT_DESK, Role.ADMIN)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_insurance_policy(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
