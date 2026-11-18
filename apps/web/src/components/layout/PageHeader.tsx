import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
      <div>
        <h1 style={{ marginBottom: subtitle ? '0.25rem' : '1rem' }}>{title}</h1>
        {subtitle ? <p style={{ margin: 0, color: 'var(--tw-muted)' }}>{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}
