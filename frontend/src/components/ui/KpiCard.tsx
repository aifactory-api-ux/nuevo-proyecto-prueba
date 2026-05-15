import { LucideIcon } from 'lucide-react';
import { tokens } from '../../styles/tokens';

interface KpiCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
  loading?: boolean;
}

export function KpiCard({ icon: Icon, value, label, color, loading = false }: KpiCardProps) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.card,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          {loading ? (
            <div className="space-y-2">
              <div
                className="h-8 w-20 animate-pulse rounded"
                style={{ backgroundColor: tokens.colors.border }}
              />
              <div
                className="h-4 w-16 animate-pulse rounded"
                style={{ backgroundColor: tokens.colors.border }}
              />
            </div>
          ) : (
            <>
              <p
                className="text-3xl font-bold"
                style={{ color: tokens.colors.textPrimary, fontSize: '32px', lineHeight: '40px' }}
              >
                {value}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: tokens.colors.textSecondary }}
              >
                {label}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}