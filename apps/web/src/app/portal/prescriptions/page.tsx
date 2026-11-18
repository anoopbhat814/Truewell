import type { Metadata } from 'next';
import type { Medication, Pharmacy, Prescription } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { PrescriptionTable } from '@/components/prescriptions/PrescriptionTable';
import { indexBy } from '@/lib/lookup';
import { apiList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Prescriptions' };

export default async function PrescriptionsPage() {
  const [prescriptions, medications, pharmacies] = await Promise.all([
    apiList<Prescription>('/prescriptions'),
    apiList<Medication>('/medications'),
    apiList<Pharmacy>('/pharmacies'),
  ]);
  return (
    <>
      <PageHeader title="Prescriptions" subtitle="Request refills by messaging your care team." />
      <Card>
        <PrescriptionTable prescriptions={prescriptions} medications={indexBy(medications)} pharmacies={indexBy(pharmacies)} />
      </Card>
    </>
  );
}
