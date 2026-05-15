import { Dispatch } from '../../types/dispatch';
import { formatDateShort } from '../../utils/formatDate';
import { tokens } from '../../styles/tokens';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface OrdersTableProps {
  dispatches: Dispatch[];
  loading?: boolean;
  deletingId: number | null;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: tokens.colors.success,
  in_transit: tokens.colors.info,
  pending: tokens.colors.warning,
  cancelled: tokens.colors.error,
};

export function OrdersTable({
  dispatches,
  loading,
  deletingId,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: OrdersTableProps) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.card,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: tokens.colors.secondary }}>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Planta
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Centro Destino
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Cantidad
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Estado
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Fecha Despacho
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Fecha Entrega
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: tokens.colors.textPrimary }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center" style={{ color: tokens.colors.textSecondary }}>
                  Cargando...
                </td>
              </tr>
            ) : dispatches.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center" style={{ color: tokens.colors.textSecondary }}>
                  No hay despachos disponibles
                </td>
              </tr>
            ) : (
              dispatches.map((dispatch, index) => (
                <tr
                  key={dispatch.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'transparent' : tokens.colors.background,
                  }}
                >
                  <td className="px-4 py-3 text-sm" style={{ color: tokens.colors.textPrimary }}>
                    {dispatch.plant}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: tokens.colors.textPrimary }}>
                    {dispatch.distribution_center}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: tokens.colors.textPrimary }}>
                    {dispatch.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: (STATUS_COLORS[dispatch.product] || tokens.colors.info) + '20',
                        color: STATUS_COLORS[dispatch.product] || tokens.colors.info,
                      }}
                    >
                      {dispatch.product}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: tokens.colors.textSecondary }}>
                    {formatDateShort(dispatch.dispatched_at)}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: tokens.colors.textSecondary }}>
                    —
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onDelete(dispatch.id)}
                      disabled={deletingId === dispatch.id}
                      className="p-1 rounded hover:bg-opacity-10 transition-colors disabled:opacity-50"
                      style={{ color: tokens.colors.error }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${tokens.colors.border}` }}>
          <span className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md disabled:opacity-50 transition-colors"
              style={{ backgroundColor: tokens.colors.background, color: tokens.colors.textPrimary }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md disabled:opacity-50 transition-colors"
              style={{ backgroundColor: tokens.colors.background, color: tokens.colors.textPrimary }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}