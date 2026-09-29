import type { ReactNode } from 'react';

export function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="modal-shell" role="dialog" aria-modal="true">
      <button className="modal-dismiss" aria-label="Fechar" onClick={onClose} />
      <div className="modal-card">
        <div className="modal-card__header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
