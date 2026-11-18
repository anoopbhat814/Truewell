import { describe, expect, it } from 'vitest';
import { canAccess, homeFor, isStaff } from './rbac';

describe('rbac', () => {
  it('routes roles to their home surface', () => {
    expect(homeFor('PATIENT')).toBe('/portal');
    expect(homeFor('NURSE')).toBe('/clinician');
    expect(isStaff('PATIENT')).toBe(false);
  });

  it('applies the most specific rule', () => {
    expect(canAccess('/clinician/claims/abc', 'BILLING')).toBe(true);
    expect(canAccess('/clinician/claims', 'NURSE')).toBe(false);
    expect(canAccess('/clinician/prescribe', 'NURSE')).toBe(false);
    expect(canAccess('/clinician/schedule', 'NURSE')).toBe(true);
    expect(canAccess('/portal/labs', 'CLINICIAN')).toBe(false);
    expect(canAccess('/login', 'PATIENT')).toBe(true);
  });
});
