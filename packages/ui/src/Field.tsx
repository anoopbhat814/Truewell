import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { id: string; describedBy?: string }) => ReactNode;
}

function FieldShell({ label, hint, error, children }: FieldShellProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="tw-field">
      <label htmlFor={id} className="tw-field__label">
        {label}
      </label>
      {children({ id, describedBy })}
      {error ? (
        <p id={`${id}-error`} role="alert" className="tw-field__error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="tw-field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Shared = { label: string; hint?: string; error?: string };

export function TextField({ label, hint, error, ...rest }: Shared & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ id, describedBy }) => (
        <input id={id} className="tw-input" aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
      )}
    </FieldShell>
  );
}

export function TextArea({ label, hint, error, ...rest }: Shared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ id, describedBy }) => (
        <textarea id={id} className="tw-input tw-input--area" aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
      )}
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  options,
  ...rest
}: Shared & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> }) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ id, describedBy }) => (
        <select id={id} className="tw-input" aria-invalid={!!error} aria-describedby={describedBy} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}
