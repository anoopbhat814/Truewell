from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rbac import CARE_TEAM, EVERYONE, STAFF, Principal, Role
from app.database import get_session
from app.deps import get_principal, require_roles
from app.pagination import Page, PageParams
from app.repositories.allergy import AllergyRepository
from app.schemas.allergy import AllergyCreate, AllergyRead, AllergyUpdate
from app.services.crud import CrudService

router = APIRouter(prefix="/allergies", tags=["allergies"])


def get_service(session: Session = Depends(get_session)):
    repo = AllergyRepository(session)
    service = CrudService(repo)
    service.entity = "allergy"
    service.patient_field = 'patient_id'
    return service


@router.get("", response_model=Page[AllergyRead])
def list_allergies(
    params: PageParams = Depends(),
    actor: Principal = Depends(get_principal),
    service=Depends(get_service),
) -> Page[AllergyRead]:
    items, total = service.list(actor, offset=params.offset, limit=params.limit)
    return Page(items=[AllergyRead.model_validate(i) for i in items], total=total, offset=params.offset, limit=params.limit)


@router.get("/{entity_id}", response_model=AllergyRead)
def get_allergy(entity_id: str, actor: Principal = Depends(get_principal), service=Depends(get_service)):
    return service.get(entity_id, actor)


@router.post("", response_model=AllergyRead, status_code=status.HTTP_201_CREATED)
def create_allergy(payload: AllergyCreate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.create(payload, actor)


@router.patch("/{entity_id}", response_model=AllergyRead)
def update_allergy(entity_id: str, payload: AllergyUpdate, actor: Principal = Depends(require_roles(*CARE_TEAM)), service=Depends(get_service)):
    return service.update(entity_id, payload, actor)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_allergy(entity_id: str, actor: Principal = Depends(require_roles(Role.ADMIN)), service=Depends(get_service)) -> None:
    service.delete(entity_id, actor)
