import { useState, useEffect, useMemo } from 'react';
import { Package, TruckIcon, Activity, CheckCircle } from 'lucide-react';
import { Header } from '../components/ui/Header';
import { FilterBar } from '../components/ui/FilterBar';
import { KpiCard } from '../components/ui/KpiCard';
import { TrendChart } from '../components/ui/TrendChart';
import { PlantChart } from '../components/ui/PlantChart';
import { OrdersTable } from '../components/ui/OrdersTable';
import { OrderForm } from '../components/ui/OrderForm';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { ToastContainer, ToastType } from '../components/ui/Toast';
import { useDispatches, useCreateDispatch, useDeleteDispatch } from '../hooks/useDispatches';
import { tokens } from '../styles/tokens';
import { DispatchCreate } from '../types/dispatch';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export function DashboardPrincipal() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { dispatches, loading: dispatchesLoading, error: dispatchesError, refetch: refetchDispatches } = useDispatches();
  const { createDispatch, loading: createLoading } = useCreateDispatch();
  const { deleteDispatch } = useDeleteDispatch();

  const showError = dispatchesError && dispatches.length === 0;

  const plants = useMemo(() => {
    const unique = [...new Set(dispatches.map(d => d.plant))];
    return unique;
  }, [dispatches]);

  const products = useMemo(() => {
    const unique = [...new Set(dispatches.map(d => d.product))];
    return unique;
  }, [dispatches]);

  const distributionCenters = useMemo(() => {
    const unique = [...new Set(dispatches.map(d => d.distribution_center))];
    return unique;
  }, [dispatches]);

  const filteredDispatches = useMemo(() => {
    return dispatches.filter(d => {
      if (selectedPlant && d.plant !== selectedPlant) return false;
      if (selectedStatus && d.product !== selectedStatus) return false;
      return true;
    });
  }, [dispatches, selectedPlant, selectedStatus]);

  const paginatedDispatches = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredDispatches.slice(start, start + 10);
  }, [filteredDispatches, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredDispatches.length / 10));

  const stats = useMemo(() => {
    return plants.map(plant => ({
      plant,
      total_quantity: dispatches.filter(d => d.plant === plant).reduce((sum, d) => sum + d.quantity, 0),
    }));
  }, [plants, dispatches]);

  const trendData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, idx) => ({
      month,
      quantity: dispatches
        .filter(d => {
          const date = new Date(d.dispatched_at);
          return date.getMonth() === idx;
        })
        .reduce((sum, d) => sum + d.quantity, 0),
    }));
  }, [dispatches]);

  const kpiData = useMemo(() => {
    return [
      { icon: Package, label: 'Total Despachos', value: dispatches.length, color: tokens.colors.primary },
      { icon: TruckIcon, label: 'En Tránsito', value: dispatches.filter(d => d.product === 'in_transit').length, color: tokens.colors.info },
      { icon: Activity, label: 'Pendientes', value: dispatches.filter(d => d.product === 'pending').length, color: tokens.colors.warning },
      { icon: CheckCircle, label: 'Entregados', value: dispatches.filter(d => d.product === 'delivered').length, color: tokens.colors.success },
    ];
  }, [dispatches]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPlant, selectedStatus]);

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateDispatch = async (data: DispatchCreate) => {
    try {
      await createDispatch(data);
      addToast('success', 'Despacho creado exitosamente');
      refetchDispatches();
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Error al crear despacho');
    }
  };

  const handleDeleteDispatch = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteDispatch(id);
      addToast('success', 'Despacho eliminado');
      refetchDispatches();
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Error al eliminar despacho');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetry = () => {
    refetchDispatches();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.background }}>
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {showError && <ErrorBanner message={dispatchesError || 'Error al cargar datos'} onRetry={handleRetry} />}

        <FilterBar
          selectedPlant={selectedPlant}
          selectedStatus={selectedStatus}
          plants={plants}
          statuses={products}
          onPlantChange={setSelectedPlant}
          onStatusChange={setSelectedStatus}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, idx) => (
            <KpiCard
              key={idx}
              icon={kpi.icon}
              value={kpi.value}
              label={kpi.label}
              color={kpi.color}
              loading={dispatchesLoading}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendChart data={trendData} loading={dispatchesLoading} />
          <PlantChart data={stats} loading={dispatchesLoading} />
        </div>

        <OrdersTable
          dispatches={paginatedDispatches}
          loading={dispatchesLoading}
          deletingId={deletingId}
          onDelete={handleDeleteDispatch}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <OrderForm
          plants={plants}
          distributionCenters={distributionCenters}
          products={products}
          onSubmit={handleCreateDispatch}
          loading={createLoading}
        />
      </main>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}