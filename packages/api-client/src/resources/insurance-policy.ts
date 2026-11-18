import type { Page } from '@truewell/types';
import type { InsurancePolicy, InsurancePolicyInput, InsurancePolicyPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function insurancePoliciesApi(http: HttpClient) {
  const base = '/api/insurance/policies';
  return {
    list: (params?: ListParams) => http.get<Page<InsurancePolicy>>(base, params),
    get: (id: string) => http.get<InsurancePolicy>(`${base}/${id}`),
    create: (input: InsurancePolicyInput) => http.post<InsurancePolicy>(base, input),
    update: (id: string, patch: InsurancePolicyPatch) => http.patch<InsurancePolicy>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
