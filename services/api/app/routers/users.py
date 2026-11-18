from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.rbac import Principal, Role
from app.database import get_session
from app.deps import require_roles
from app.models.user import User
from app.pagination import Page, PageParams

router = APIRouter(prefix="/users", tags=["users"])


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    role: str
    display_name: str
    mfa_enabled: bool


@router.get("", response_model=Page[UserRead])
def list_users(
    role: str | None = None,
    params: PageParams = Depends(),
    _: Principal = Depends(require_roles(Role.ADMIN)),
    session: Session = Depends(get_session),
) -> Page[UserRead]:
    stmt = select(User)
    if role:
        stmt = stmt.where(User.role == role)
    rows = list(session.scalars(stmt.order_by(User.created_at.desc()).offset(params.offset).limit(params.limit)))
    return Page(items=[UserRead.model_validate(r) for r in rows], total=len(rows), offset=params.offset, limit=params.limit)
