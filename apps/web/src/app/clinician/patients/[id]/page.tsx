import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Allergy, CarePlan, LabResult, LabOrder, Medication, Patient, Prescription } from '@truewell/types';
import { Card } from '@truewell/ui';
import { fullName } from '@truewell/utils';
import { LabResultTable } from '@/components/labs/LabResultTable';
import { PatientSummary } from '@/components/clinician/PatientSummary';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, apiList, ServerApiError } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Patient chart' };

export default async function PatientChart({ params }: { params: { id: string } }) {
  try {
    const patient = await apiGet<Patient>(`/patients/${params.id}`);
    const [allergies, prescriptions, carePlans, orders, medications] = await Promise.all([
      apiList<Allergy>('/allergies', { patientId: patient.id }),
      apiList<Prescription>('/prescriptions', { patientId: patient.id }),
      apiList<CarePlan>('/care-plans', { patientId: patient.id }),
      apiList<LabOrder>('/lab-orders', { patientId: patient.id }),
      apiList<Medication>('/medications'),
    ]);
    const results = (await Promise.all(orders.map((o) => apiList<LabResult>('/lab-results', { orderId: o.id })))).flat();
    return (
      <>
        <PageHeader title={fullName(patient)} subtitle="Chart access is recorded in the audit log." />
        <PatientSummary
          patient={patient}
          allergies={allergies}
          prescriptions={prescriptions}
          carePlans={carePlans}
          medicationNames={Object.fromEntries(medications.map((m) => [m.id, m.name]))}
        />
        <Card title="Recent results">
          <LabResultTable results={results} showRelease />
        </Card>
      </>
    );
  } catch (e) {
    if (e instanceof ServerApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
}
