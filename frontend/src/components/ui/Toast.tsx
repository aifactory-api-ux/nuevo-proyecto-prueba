import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { tokens } from '../../styles/tokens';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss: () => void;
  duration?: number;
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
};

const COLORS = {
  success: tokens.colors.success,
  error: tokens.colors.error,
  warning: tokens.colors.warning,
  info: tokens.colors.info,
};

export function Toast({ type, message, onDismiss, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = ICONS[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${COLORS[type]}`,
        boxShadow: tokens.shadows.elevated,
        minWidth: '300px',
      }}
    >
      <Icon size={20} style={{ color: COLORS[type] }} />
      <p className="flex-1 text-sm" style={{ color: tokens.colors.textPrimary }}>
        {message}
      </p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onDismiss, 300);
        }}
        className="p-1 rounded hover:bg-opacity-10 transition-colors"
        style={{ color: tokens.colors.textSecondary }}
      >
        <XCircle size={16} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}