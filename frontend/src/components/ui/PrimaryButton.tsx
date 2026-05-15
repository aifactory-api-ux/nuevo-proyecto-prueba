import { tokens } from '../../styles/tokens';

interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PrimaryButton({
  children,
  type = 'button',
  onClick,
  loading = false,
  disabled = false,
  className = '',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: tokens.colors.primary,
        color: '#ffffff',
        borderRadius: tokens.radii.md,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = '#4F46E5';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors.primary;
      }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}