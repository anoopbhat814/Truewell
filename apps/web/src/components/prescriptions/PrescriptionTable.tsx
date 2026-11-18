import type { Medication, Pharmacy, Prescription } from '@truewell/types';
import { StatusBadge, Table } from '@truewell/ui';
import { formatDateTime } from '@truewell/utils';

export interface PrescriptionTableProps {
  prescriptions: Prescription[];
  medications: Record<string, Medication | undefined>;
  pharmacies: Record<string, Pharmacy | undefined>;
}

export function PrescriptionTable({ prescriptions, medications, pharmacies }: PrescriptionTableProps) {
  return (
    <Table
      caption="Prescriptions"
      rows={prescriptions}
      rowKey={(p) => p.id}
      empty="You have no prescriptions on file."
      columns={[
        {
          key: 'drug',
          header: 'Medication',
          render: (p) => {
            const med = medications[p.medicationId];
            return (
              <div>
                <strong>{med?.name ?? 'Unknown medication'}</strong>
                <div style={{ color: 'var(--tw-muted)', fontSize: '0.85rem' }}>{med?.strength}</div>
              </div>
            );
          },
        },
        { key: 'sig', header: 'Directions', render: (p) => `${p.dosage}, ${p.frequency}` },
        { key: 'refills', header: 'Refills', align: 'right', render: (p) => p.refills },
        { key: 'pharmacy', header: 'Pharmacy', render: (p) => (p.pharmacyId ? pharmacies[p.pharmacyId]?.name ?? '-' : '-') },
        { key: 'issued', header: 'Issued', render: (p) => (p.issuedAt ? formatDateTime(p.issuedAt) : '-') },
        { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
      ]}
    />
  );
}
