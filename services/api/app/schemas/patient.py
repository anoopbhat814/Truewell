from datetime import date

from pydantic import BaseModel, ConfigDict, Field



class PatientCreate(BaseModel):
    user_id: str
    mrn: str = Field(min_length=1, max_length=255)
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    date_of_birth: date
    sex_at_birth: str | None = None
    phone: str | None = None
    preferred_lang: str = 'en'
    primary_clinician_id: str | None = None


class PatientUpdate(BaseModel):
    user_id: str | None = None
    mrn: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    sex_at_birth: str | None = None
    phone: str | None = None
    preferred_lang: str | None = None
    primary_clinician_id: str | None = None


class PatientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    mrn: str
    first_name: str
    last_name: str
    date_of_birth: date
    sex_at_birth: str | None
    phone: str | None
    preferred_lang: str
    primary_clinician_id: str | None
