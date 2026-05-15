import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tokens } from '../../styles/tokens';

interface TrendChartProps {
  data: { month: string; quantity: number }[];
  loading?: boolean;
}

export function TrendChart({ data, loading = false }: TrendChartProps) {
  if (loading) {
    return (
      <div
        className="p-4 rounded-lg h-80 animate-pulse"
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
        }}
      />
    );
  }

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.card,
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: tokens.colors.textPrimary }}>
        Tendencia Mensual
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.colors.border} />
          <XAxis dataKey="month" stroke={tokens.colors.textSecondary} />
          <YAxis stroke={tokens.colors.textSecondary} />
          <Tooltip
            contentStyle={{
              backgroundColor: tokens.colors.surface,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radii.md,
              color: tokens.colors.textPrimary,
            }}
          />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke={tokens.colors.primary}
            strokeWidth={2}
            dot={{ fill: tokens.colors.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}