import Link from 'next/link';

export function StatTile({ label, value, href, tone }: { label: string; value: number | string; href?: string; tone?: 'danger' | 'warning' }) {
  const body = (
    <div className="tw-card__body">
      <div style={{ color: 'var(--tw-muted)', fontSize: '0.85rem' }}>{label}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 700, color: tone ? `var(--tw-${tone})` : undefined }}>{value}</div>
    </div>
  );
  return <section className="tw-card">{href ? <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{body}</Link> : body}</section>;
}
