'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppointmentMode, AppointmentType, Clinician, OpenSlot } from '@truewell/types';
import { Button, Card, SelectField, TextField } from '@truewell/ui';
import { toIsoDate } from '@truewell/utils';
import { api } from '@/lib/client';
import { useFormState } from '@/hooks/useFormState';
import { useOpenSlots } from '@/hooks/useOpenSlots';
import { SlotPicker } from './SlotPicker';

export interface BookingFormProps {
  patientId: string;
  clinicians: Array<Clinician & { name: string }>;
  types: AppointmentType[];
}

export function BookingForm({ patientId, clinicians, types }: BookingFormProps) {
  const router = useRouter();
  const [typeId, setTypeId] = useState(types[0]?.id ?? '');
  const [clinicianId, setClinicianId] = useState(clinicians[0]?.id ?? '');
  const [day, setDay] = useState(toIsoDate(new Date(Date.now() + 86_400_000)));
  const [mode, setMode] = useState<AppointmentMode>('IN_PERSON');
  const [reason, setReason] = useState('');
  const [slot, setSlot] = useState<OpenSlot | null>(null);

  const selectedType = types.find((t) => t.id === typeId);
  const { slots, isLoading } = useOpenSlots(clinicianId || null, day, selectedType?.durationMinutes ?? 20);

  const form = useFormState<OpenSlot>(async (chosen) => {
    await api.appointments.create({
      patientId,
      clinicianId,
      typeId,
      mode,
      reason: reason || null,
      startsAt: new Date(chosen.startsAt).toISOString(),
      endsAt: new Date(chosen.endsAt).toISOString(),
    });
    router.push('/portal/appointments');
    router.refresh();
  });

  return (
    <Card title="Request an appointment">
      <SelectField label="Visit type" value={typeId} onChange={(e) => { setTypeId(e.target.value); setSlot(null); }} options={types.map((t) => ({ value: t.id, label: `${t.label} (${t.durationMinutes} min)` }))} />
      <SelectField label="Clinician" value={clinicianId} onChange={(e) => { setClinicianId(e.target.value); setSlot(null); }} options={clinicians.map((c) => ({ value: c.id, label: `${c.name} - ${c.specialty}` }))} />
      <SelectField
        label="Visit format"
        value={mode}
        onChange={(e) => setMode(e.target.value as AppointmentMode)}
        options={[
          { value: 'IN_PERSON', label: 'In person' },
          ...(selectedType?.telehealthOk ? [{ value: 'VIDEO', label: 'Video' }, { value: 'PHONE', label: 'Phone' }] : []),
        ]}
      />
      <TextField label="Date" type="date" min={toIsoDate(new Date())} value={day} onChange={(e) => { setDay(e.target.value); setSlot(null); }} />
      <SlotPicker slots={slots} loading={isLoading} selected={slot?.startsAt ?? null} onSelect={setSlot} />
      <TextField label="Reason for visit" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={255} style={{ marginTop: '1rem' }} />
      {form.error ? <p role="alert" className="tw-field__error">{form.error}</p> : null}
      <Button disabled={!slot} loading={form.pending} onClick={() => slot && void form.run(slot)}>
        Request appointment
      </Button>
    </Card>
  );
}
