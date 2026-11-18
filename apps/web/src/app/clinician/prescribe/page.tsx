import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { Medication, Patient, Pharmacy } from '@truewell/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { PrescribeForm } from '@/components/prescriptions/PrescribeForm';
import { apiList } from '@/lib/server-api';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Prescribe' };

export default async function PrescribePage() {
  const session = getSession();
  if (!session?.clinicianId) redirect('/clinician');
  const [patients, medications, pharmacies] = await Promise.all([
    apiList<Patient>('/patients'),
    apiList<Medication>('/medications'),
    apiList<Pharmacy>('/pharmacies'),
  ]);
  return (
    <>
      <PageHeader title="E-prescribe" subtitle="Interaction and allergy checks run when you sign." />
      <PrescribeForm clinicianId={session.clinicianId} patients={patients} medications={medications} pharmacies={pharmacies} />
    </>
  );
}
