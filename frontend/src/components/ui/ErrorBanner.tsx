import { AlertCircle, RefreshCw } from 'lucide-react';
import { tokens } from '../../styles/tokens';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg mb-4"
      style={{
        backgroundColor: tokens.colors.error + '15',
        border: `1px solid ${tokens.colors.error}`,
      }}
    >
      <div className="flex items-center gap-3">
        <AlertCircle size={20} style={{ color: tokens.colors.error }} />
        <p className="text-sm" style={{ color: tokens.colors.error }}>
          {message}
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        style={{
          backgroundColor: tokens.colors.error,
          color: '#ffffff',
        }}
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  );
}