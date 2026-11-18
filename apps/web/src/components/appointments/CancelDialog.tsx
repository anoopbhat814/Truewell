'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Appointment } from '@truewell/types';
import { Button, Modal, TextArea } from '@truewell/ui';
import { actions } from '@/lib/client';
import { useFormState } from '@/hooks/useFormState';

export function CancelDialog({ appointment, onClose }: { appointment: Appointment | null; onClose: () => void }) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const form = useFormState<string>(async (why) => {
    if (!appointment) return;
    await actions.cancelAppointment(appointment.id, why);
    setReason('');
    onClose();
    router.refresh();
  });

  return (
    <Modal
      open={appointment !== null}
      title="Cancel this appointment?"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Keep appointment
          </Button>
          <Button variant="danger" loading={form.pending} onClick={() => void form.run(reason.trim() || 'Cancelled by patient')}>
            Cancel appointment
          </Button>
        </>
      }
    >
      <TextArea label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={255} />
      {form.error ? <p role="alert" className="tw-field__error">{form.error}</p> : null}
    </Modal>
  );
}
