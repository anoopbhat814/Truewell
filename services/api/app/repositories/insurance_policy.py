from app.models.insurance_policy import InsurancePolicy
from app.repositories.base import BaseRepository


class InsurancePolicyRepository(BaseRepository[InsurancePolicy]):
    model = InsurancePolicy
    order_by = "id"
