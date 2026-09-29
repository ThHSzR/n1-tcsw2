import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}
         style={{ color: type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: 16 }}>
      </i>
      {message}
    </div>
  );
}
