'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="tw-modal" aria-labelledby="tw-modal-title" onClose={onClose} onCancel={onClose}>
      <h2 id="tw-modal-title" className="tw-modal__title">
        {title}
      </h2>
      <div className="tw-modal__body">{children}</div>
      {footer ? <footer className="tw-modal__footer">{footer}</footer> : null}
    </dialog>
  );
}
