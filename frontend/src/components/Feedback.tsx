import type { ReactNode } from 'react';

export function LoadingState({ label = 'Carregando dados' }: { label?: string }) {
  return (
    <div className="state-panel">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{label}...</span>
    </div>
  );
}

export function EmptyState({
  icon = 'bi-inbox',
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><i className={`bi ${icon}`} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
      <i className="bi bi-exclamation-circle-fill" />
      <span>{message}</span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
