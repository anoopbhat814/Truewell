from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=256)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=256)
    display_name: str = Field(min_length=1, max_length=120)
    first_name: str
    last_name: str
    date_of_birth: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    refresh_token: str


class Me(BaseModel):
    user_id: str
    role: str
    patient_id: str | None = None
    clinician_id: str | None = None
