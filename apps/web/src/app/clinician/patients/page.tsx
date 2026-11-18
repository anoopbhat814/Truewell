import type { Metadata } from 'next';
import type { Patient } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PatientSearch } from '@/components/clinician/PatientSearch';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Patients' };

export default async function PatientsPage() {
  const patients = await apiList<Patient>('/patients');
  return (
    <>
      <PageHeader title="Patients" />
      <Card>
        <PatientSearch patients={patients} />
      </Card>
    </>
  );
}
