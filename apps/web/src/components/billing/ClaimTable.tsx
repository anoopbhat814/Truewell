import type { Claim } from '@truewell/types';
import { StatusBadge, Table } from '@truewell/ui';
import { formatCents, formatDateTime } from '@truewell/utils';

export function ClaimTable({ claims, actions }: { claims: Claim[]; actions?: (c: Claim) => React.ReactNode }) {
  return (
    <Table
      caption="Claims"
      rows={claims}
      rowKey={(c) => c.id}
      empty="No claims yet."
      columns={[
        { key: 'id', header: 'Claim', render: (c) => `#${c.id.slice(-6).toUpperCase()}` },
        { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
        { key: 'total', header: 'Billed', align: 'right', render: (c) => formatCents(c.totalCents) },
        { key: 'allowed', header: 'Allowed', align: 'right', render: (c) => (c.allowedCents != null ? formatCents(c.allowedCents) : '-') },
        { key: 'paid', header: 'Paid', align: 'right', render: (c) => (c.paidCents != null ? formatCents(c.paidCents) : '-') },
        { key: 'submitted', header: 'Submitted', render: (c) => (c.submittedAt ? formatDateTime(c.submittedAt) : '-') },
        ...(actions ? [{ key: 'actions', header: '', render: (c: Claim) => actions(c) }] : []),
      ]}
    />
  );
}
