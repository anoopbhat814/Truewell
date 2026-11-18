from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AbnormalFlag


class LabResultCreate(BaseModel):
    order_id: str
    analyte: str = Field(min_length=1, max_length=255)
    loinc_code: str | None = None
    value: Decimal
    unit: str = Field(min_length=1, max_length=255)
    ref_low: Decimal | None = None
    ref_high: Decimal | None = None
    flag: AbnormalFlag = AbnormalFlag.NORMAL
    released_to_patient: bool = False


class LabResultUpdate(BaseModel):
    order_id: str | None = None
    analyte: str | None = None
    loinc_code: str | None = None
    value: Decimal | None = None
    unit: str | None = None
    ref_low: Decimal | None = None
    ref_high: Decimal | None = None
    flag: AbnormalFlag | None = None
    released_to_patient: bool | None = None


class LabResultRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_id: str
    analyte: str
    loinc_code: str | None
    value: Decimal
    unit: str
    ref_low: Decimal | None
    ref_high: Decimal | None
    flag: AbnormalFlag
    released_to_patient: bool
    resulted_at: datetime
