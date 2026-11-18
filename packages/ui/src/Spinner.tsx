export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="tw-spinner-wrap">
      <span className="tw-spinner" aria-hidden="true" />
      <span className="tw-sr-only">{label}</span>
    </span>
  );
}
