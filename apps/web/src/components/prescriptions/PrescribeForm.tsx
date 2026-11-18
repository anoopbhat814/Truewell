'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Medication, Patient, Pharmacy } from '@truewell/types';
import { Button, Card, SelectField, TextField } from '@truewell/ui';
import { fullName } from '@truewell/utils';
import { actions, api } from '@/lib/client';
import { useFormState } from '@/hooks/useFormState';

export interface PrescribeFormProps {
  clinicianId: string;
  patients: Patient[];
  medications: Medication[];
  pharmacies: Pharmacy[];
}

export function PrescribeForm({ clinicianId, patients, medications, pharmacies }: PrescribeFormProps) {
  const router = useRouter();
  const [v, setV] = useState({
    patientId: patients[0]?.id ?? '',
    medicationId: medications[0]?.id ?? '',
    pharmacyId: pharmacies[0]?.id ?? '',
    dosage: '',
    frequency: '',
    quantity: '30',
    refills: '0',
    instructions: '',
  });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  const med = medications.find((m) => m.id === v.medicationId);

  const form = useFormState<typeof v>(async (values) => {
    const draft = await api.prescriptions.create({
      patientId: values.patientId,
      clinicianId,
      medicationId: values.medicationId,
      pharmacyId: values.pharmacyId || null,
      dosage: values.dosage,
      frequency: values.frequency,
      quantity: Number(values.quantity),
      refills: Number(values.refills),
      instructions: values.instructions || null,
    });
    await actions.sendPrescription(draft.id);
    router.push('/clinician/patients');
    router.refresh();
  });

  return (
    <Card title="New prescription">
      <SelectField label="Patient" value={v.patientId} onChange={set('patientId')} options={patients.map((p) => ({ value: p.id, label: `${fullName(p)} (${p.mrn})` }))} />
      <SelectField label="Medication" value={v.medicationId} onChange={set('medicationId')} options={medications.map((m) => ({ value: m.id, label: `${m.name} ${m.strength ?? ''}`.trim() }))} />
      {med?.isControlled ? <p role="note" className="tw-field__hint">Controlled substance: refills are not permitted and the prescription is valid for 30 days.</p> : null}
      <TextField label="Dosage" value={v.dosage} onChange={set('dosage')} required />
      <TextField label="Frequency" value={v.frequency} onChange={set('frequency')} required />
      <TextField label="Quantity" type="number" min={1} value={v.quantity} onChange={set('quantity')} required />
      <TextField label="Refills" type="number" min={0} max={med?.isControlled ? 0 : 11} value={v.refills} onChange={set('refills')} />
      <SelectField label="Pharmacy" value={v.pharmacyId} onChange={set('pharmacyId')} options={pharmacies.map((p) => ({ value: p.id, label: `${p.name}, ${p.city}` }))} />
      <TextField label="Instructions to patient" value={v.instructions} onChange={set('instructions')} />
      {form.error ? <p role="alert" className="tw-field__error">{form.error}</p> : null}
      <Button loading={form.pending} onClick={() => void form.run(v)}>
        Sign and send
      </Button>
    </Card>
  );
}
