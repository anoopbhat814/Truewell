import type { LabResult } from '@truewell/types';
import { RangeBar, StatusBadge, Table } from '@truewell/ui';
import { formatDateTime, formatRange } from '@truewell/utils';

export function LabResultTable({ results, showRelease = false }: { results: LabResult[]; showRelease?: boolean }) {
  return (
    <Table
      caption="Laboratory results"
      rows={results}
      rowKey={(r) => r.id}
      empty="No lab results have been released yet."
      columns={[
        { key: 'analyte', header: 'Test', render: (r) => <strong>{r.analyte}</strong> },
        { key: 'value', header: 'Result', align: 'right', render: (r) => `${r.value} ${r.unit}` },
        { key: 'range', header: 'Reference', render: (r) => formatRange(r.refLow, r.refHigh, r.unit) },
        { key: 'bar', header: '', render: (r) => <RangeBar value={r.value} refLow={r.refLow} refHigh={r.refHigh} /> },
        { key: 'flag', header: 'Flag', render: (r) => <StatusBadge status={r.flag} /> },
        { key: 'date', header: 'Resulted', render: (r) => formatDateTime(r.resultedAt) },
        ...(showRelease ? [{ key: 'released', header: 'Portal', render: (r: LabResult) => (r.releasedToPatient ? 'Released' : 'Held') }] : []),
      ]}
    />
  );
}
