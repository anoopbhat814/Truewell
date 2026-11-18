from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.rbac import Principal, Role
from app.database import get_session
from app.errors import AuthenticationError, ForbiddenError
from app.security import decode_access_token


def get_principal(authorization: str | None = Header(default=None)) -> Principal:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AuthenticationError("Missing bearer token")
    return decode_access_token(authorization.split(" ", 1)[1])


def require_roles(*roles: Role):
    allowed = frozenset(roles)

    def checker(principal: Principal = Depends(get_principal)) -> Principal:
        if principal.role not in allowed:
            raise ForbiddenError("Your role does not permit this action")
        return principal

    return checker


def db_session() -> Session:  # pragma: no cover - thin alias for readability in routers
    raise RuntimeError("db_session is replaced by get_session via dependency override")


SessionDep = Depends(get_session)
CurrentUser = Depends(get_principal)
