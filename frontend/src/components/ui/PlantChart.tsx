import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { tokens } from '../../styles/tokens';

interface PlantChartProps {
  data: { plant: string; total_quantity: number }[];
  loading?: boolean;
}

const PLANT_COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6'];

export function PlantChart({ data, loading = false }: PlantChartProps) {
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
        Volumen por Planta
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.colors.border} />
          <XAxis dataKey="plant" stroke={tokens.colors.textSecondary} />
          <YAxis stroke={tokens.colors.textSecondary} />
          <Tooltip
            contentStyle={{
              backgroundColor: tokens.colors.surface,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radii.md,
              color: tokens.colors.textPrimary,
            }}
          />
          <Bar dataKey="total_quantity">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PLANT_COLORS[index % PLANT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}