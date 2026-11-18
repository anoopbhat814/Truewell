import type { ButtonHTMLAttributes } from 'react';
import { cx } from './cx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({ variant = 'primary', loading = false, disabled, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx('tw-btn', `tw-btn--${variant}`, loading && 'tw-btn--loading', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="tw-spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
