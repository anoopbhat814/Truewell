import type { Allergy, CarePlan, Patient, Prescription } from '@truewell/types';
import { Badge, Card, StatusBadge } from '@truewell/ui';
import { ageFromDob, fullName } from '@truewell/utils';

export interface PatientSummaryProps {
  patient: Patient;
  allergies: Allergy[];
  prescriptions: Prescription[];
  carePlans: CarePlan[];
  medicationNames: Record<string, string>;
}

export function PatientSummary({ patient, allergies, prescriptions, carePlans, medicationNames }: PatientSummaryProps) {
  const active = prescriptions.filter((p) => p.status === 'SENT' || p.status === 'FILLED');
  return (
    <div className="tw-grid">
      <Card title="Demographics">
        <p style={{ marginTop: 0 }}>
          <strong>{fullName(patient)}</strong>, {ageFromDob(patient.dateOfBirth)}
        </p>
        <p>MRN {patient.mrn}</p>
        <p style={{ marginBottom: 0 }}>Language: {patient.preferredLang}</p>
      </Card>
      <Card title="Allergies">
        {allergies.length === 0 ? <p>No known allergies.</p> : allergies.map((a) => (
          <div key={a.id}>
            {a.substance} <Badge tone={a.severity === 'severe' ? 'danger' : 'warning'}>{a.severity}</Badge>
          </div>
        ))}
      </Card>
      <Card title="Active medications">
        {active.length === 0 ? <p>None.</p> : active.map((p) => (
          <div key={p.id}>
            {medicationNames[p.medicationId] ?? 'Medication'} - {p.dosage}, {p.frequency}
          </div>
        ))}
      </Card>
      <Card title="Care plans">
        {carePlans.length === 0 ? <p>No care plans.</p> : carePlans.map((c) => (
          <div key={c.id}>
            {c.title} <StatusBadge status={c.status} />
          </div>
        ))}
      </Card>
    </div>
  );
}
