import { tokens } from '../../styles/tokens';

interface FilterBarProps {
  selectedPlant: string;
  selectedStatus: string;
  plants: string[];
  statuses: string[];
  onPlantChange: (plant: string) => void;
  onStatusChange: (status: string) => void;
}

export function FilterBar({
  selectedPlant,
  selectedStatus,
  plants,
  statuses,
  onPlantChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-4 p-4 rounded-lg"
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium"
          style={{ color: tokens.colors.textSecondary }}
        >
          Planta
        </label>
        <select
          value={selectedPlant}
          onChange={(e) => onPlantChange(e.target.value)}
          className="px-3 py-2 rounded-md outline-none"
          style={{
            backgroundColor: tokens.colors.background,
            color: tokens.colors.textPrimary,
            border: `1px solid ${tokens.colors.border}`,
          }}
        >
          <option value="">Todas</option>
          {plants.map((plant) => (
            <option key={plant} value={plant}>
              {plant}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium"
          style={{ color: tokens.colors.textSecondary }}
        >
          Estado
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 rounded-md outline-none"
          style={{
            backgroundColor: tokens.colors.background,
            color: tokens.colors.textPrimary,
            border: `1px solid ${tokens.colors.border}`,
          }}
        >
          <option value="">Todos</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}