import type { Metadata } from 'next';
import type { Allergy, Document, Patient } from '@truewell/types';
import { Card, Table } from '@truewell/ui';
import { ageFromDob, fullName, maskPhone } from '@truewell/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, apiList } from '@/lib/server-api';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const session = getSession();
  const patient = await apiGet<Patient>(`/patients/${session?.patientId}`);
  const [allergies, documents] = await Promise.all([apiList<Allergy>('/allergies'), apiList<Document>('/documents')]);
  return (
    <>
      <PageHeader title={fullName(patient)} subtitle={`${patient.mrn} - age ${ageFromDob(patient.dateOfBirth)}`} />
      <Card title="Contact">
        <p>Phone: {patient.phone ? maskPhone(patient.phone) : 'Not provided'}</p>
        <p>Preferred language: {patient.preferredLang}</p>
      </Card>
      <Card title="Allergies">
        <Table
          rows={allergies}
          rowKey={(a) => a.id}
          empty="No allergies recorded."
          columns={[
            { key: 's', header: 'Substance', render: (a) => a.substance },
            { key: 'r', header: 'Reaction', render: (a) => a.reaction ?? '-' },
            { key: 'v', header: 'Severity', render: (a) => a.severity },
          ]}
        />
      </Card>
      <Card title="Documents">
        <Table
          rows={documents}
          rowKey={(d) => d.id}
          empty="No documents."
          columns={[
            { key: 't', header: 'Title', render: (d) => d.title },
            { key: 'c', header: 'Category', render: (d) => d.category },
          ]}
        />
      </Card>
    </>
  );
}
