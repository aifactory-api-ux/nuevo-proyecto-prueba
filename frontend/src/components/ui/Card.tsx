import { tokens } from '../../styles/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`p-5 rounded-lg ${className}`}
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.card,
        borderRadius: tokens.radii.md,
      }}
    >
      {children}
    </div>
  );
}