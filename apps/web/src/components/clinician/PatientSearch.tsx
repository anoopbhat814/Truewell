'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Patient } from '@truewell/types';
import { Avatar, TextField } from '@truewell/ui';
import { ageFromDob, fullName } from '@truewell/utils';
import { useDebounce } from '@/hooks/useDebounce';

export function matchPatients(patients: Patient[], query: string): Patient[] {
  const q = query.trim().toLowerCase();
  if (!q) return patients;
  return patients.filter((p) => fullName(p).toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q));
}

export function PatientSearch({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);
  const results = useMemo(() => matchPatients(patients, debounced), [patients, debounced]);

  return (
    <div>
      <TextField label="Search by name or MRN" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul style={{ listStyle: 'none', padding: 0 }} aria-live="polite">
        {results.map((p) => (
          <li key={p.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--tw-border)' }}>
            <Avatar first={p.firstName} last={p.lastName} />
            <Link href={`/clinician/patients/${p.id}`}>{fullName(p)}</Link>
            <span style={{ color: 'var(--tw-muted)' }}>
              {p.mrn} - age {ageFromDob(p.dateOfBirth)}
            </span>
          </li>
        ))}
      </ul>
      {results.length === 0 ? <p className="tw-empty">No patients match &ldquo;{debounced}&rdquo;.</p> : null}
    </div>
  );
}
