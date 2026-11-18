import { describe, expect, it } from 'vitest';
import type { Patient } from '@truewell/types';
import { matchPatients } from './PatientSearch';

const p = (id: string, firstName: string, lastName: string, mrn: string) => ({ id, firstName, lastName, mrn }) as Patient;
const patients = [p('1', 'Sam', 'Patel', 'MRN-100001'), p('2', 'Lena', 'Fischer', 'MRN-100002')];

describe('matchPatients', () => {
  it('matches names and MRNs case-insensitively', () => {
    expect(matchPatients(patients, 'patel').map((x) => x.id)).toEqual(['1']);
    expect(matchPatients(patients, 'mrn-100002').map((x) => x.id)).toEqual(['2']);
    expect(matchPatients(patients, 'lena f').map((x) => x.id)).toEqual(['2']);
  });

  it('returns everyone for an empty query', () => {
    expect(matchPatients(patients, '  ')).toHaveLength(2);
  });
});
