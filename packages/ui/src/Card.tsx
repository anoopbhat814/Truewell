import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  actions?: ReactNode;
}

export function Card({ title, actions, className, children, ...rest }: CardProps) {
  return (
    <section className={cx('tw-card', className)} {...rest}>
      {title || actions ? (
        <header className="tw-card__header">
          {title ? <h2 className="tw-card__title">{title}</h2> : <span />}
          {actions}
        </header>
      ) : null}
      <div className="tw-card__body">{children}</div>
    </section>
  );
}
