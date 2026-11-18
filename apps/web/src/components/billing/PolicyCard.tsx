import type { InsurancePolicy } from '@truewell/types';
import { Card } from '@truewell/ui';
import { formatCents, maskMemberId } from '@truewell/utils';

export function PolicyCard({ policy }: { policy: InsurancePolicy }) {
  return (
    <Card title={policy.payerName} actions={<span>{policy.planType}</span>}>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem' }}>
        <dt>Member ID</dt>
        <dd style={{ margin: 0 }}>{maskMemberId(policy.memberId)}</dd>
        {policy.groupNumber ? (
          <>
            <dt>Group</dt>
            <dd style={{ margin: 0 }}>{policy.groupNumber}</dd>
          </>
        ) : null}
        <dt>Copay</dt>
        <dd style={{ margin: 0 }}>{formatCents(policy.copayCents)}</dd>
        <dt>Deductible</dt>
        <dd style={{ margin: 0 }}>{formatCents(policy.deductibleCents)}</dd>
        <dt>Effective</dt>
        <dd style={{ margin: 0 }}>{policy.effectiveOn}</dd>
      </dl>
    </Card>
  );
}
