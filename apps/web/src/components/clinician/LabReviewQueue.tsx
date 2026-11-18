'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { LabResult } from '@truewell/types';
import { Button, RangeBar, StatusBadge, Table } from '@truewell/ui';
import { formatRange } from '@truewell/utils';
import { api } from '@/lib/client';

export function LabReviewQueue({ results }: { results: LabResult[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function release(id: string) {
    setBusy(id);
    try {
      await api.labResults.update(id, { releasedToPatient: true });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <Table
      caption="Results awaiting review"
      rows={results}
      rowKey={(r) => r.id}
      empty="Nothing is waiting for review."
      columns={[
        { key: 'analyte', header: 'Test', render: (r) => <strong>{r.analyte}</strong> },
        { key: 'value', header: 'Result', align: 'right', render: (r) => `${r.value} ${r.unit}` },
        { key: 'range', header: 'Reference', render: (r) => formatRange(r.refLow, r.refHigh, r.unit) },
        { key: 'bar', header: '', render: (r) => <RangeBar value={r.value} refLow={r.refLow} refHigh={r.refHigh} /> },
        { key: 'flag', header: 'Flag', render: (r) => <StatusBadge status={r.flag} /> },
        {
          key: 'release',
          header: '',
          render: (r) => (
            <Button variant="secondary" loading={busy === r.id} onClick={() => void release(r.id)}>
              Release to patient
            </Button>
          ),
        },
      ]}
    />
  );
}
