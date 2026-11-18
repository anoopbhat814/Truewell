from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.rbac import Principal
from app.database import get_session
from app.deps import get_principal
from app.schemas.auth import LoginRequest, Me, RefreshRequest, RegisterRequest, TokenPair
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, session: Session = Depends(get_session)) -> dict[str, str]:
    user = AuthService(session).register_patient(body)
    return {"id": user.id, "email": user.email}


@router.post("/login", response_model=TokenPair)
def login(body: LoginRequest, request: Request, session: Session = Depends(get_session)) -> TokenPair:
    client_ip = request.client.host if request.client else None
    return AuthService(session).login(body.email, body.password, request.headers.get("user-agent"), client_ip)


@router.post("/refresh", response_model=TokenPair)
def refresh(body: RefreshRequest, request: Request, session: Session = Depends(get_session)) -> TokenPair:
    client_ip = request.client.host if request.client else None
    return AuthService(session).refresh(body.refresh_token, request.headers.get("user-agent"), client_ip)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(body: RefreshRequest, session: Session = Depends(get_session)) -> None:
    AuthService(session).logout(body.refresh_token)


@router.get("/me", response_model=Me)
def me(principal: Principal = Depends(get_principal)) -> Me:
    return Me(
        user_id=principal.user_id,
        role=principal.role.value,
        patient_id=principal.patient_id,
        clinician_id=principal.clinician_id,
    )
