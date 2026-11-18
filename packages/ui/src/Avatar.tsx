import { initials } from '@truewell/utils';

export function Avatar({ first, last, size = 36 }: { first: string; last: string; size?: number }) {
  const label = `${first} ${last}`;
  return (
    <span className="tw-avatar" role="img" aria-label={label} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials(first, last)}
    </span>
  );
}
