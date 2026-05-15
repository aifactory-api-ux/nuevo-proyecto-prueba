import { useState } from 'react';
import { DispatchCreate } from '../../types/dispatch';
import { tokens } from '../../styles/tokens';
import { PrimaryButton } from './PrimaryButton';

interface OrderFormProps {
  plants: string[];
  distributionCenters: string[];
  products: string[];
  onSubmit: (data: DispatchCreate) => Promise<void>;
  loading?: boolean;
}

export function OrderForm({
  plants,
  distributionCenters,
  products,
  onSubmit,
  loading = false,
}: OrderFormProps) {
  const [formData, setFormData] = useState<DispatchCreate>({
    plant: '',
    distribution_center: '',
    product: '',
    quantity: 0,
    dispatched_at: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DispatchCreate, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DispatchCreate, string>> = {};
    if (!formData.plant) newErrors.plant = 'La planta es obligatoria';
    if (!formData.distribution_center) newErrors.distribution_center = 'El centro de destino es obligatorio';
    if (!formData.product) newErrors.product = 'El producto es obligatorio';
    if (formData.quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0';
    if (!formData.dispatched_at) newErrors.dispatched_at = 'La fecha de despacho es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
    setFormData({
      plant: '',
      distribution_center: '',
      product: '',
      quantity: 0,
      dispatched_at: new Date().toISOString(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-lg space-y-4"
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.card,
      }}
    >
      <h3 className="text-lg font-semibold" style={{ color: tokens.colors.textPrimary }}>
        Crear Nuevo Despacho
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: tokens.colors.textSecondary }}>
            Planta
          </label>
          <select
            value={formData.plant}
            onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
            className="px-3 py-2 rounded-md outline-none"
            style={{
              backgroundColor: tokens.colors.background,
              color: tokens.colors.textPrimary,
              border: `1px solid ${errors.plant ? tokens.colors.error : tokens.colors.border}`,
            }}
          >
            <option value="">Seleccionar planta</option>
            {plants.map((plant) => (
              <option key={plant} value={plant}>{plant}</option>
            ))}
          </select>
          {errors.plant && (
            <span className="text-xs" style={{ color: tokens.colors.error }}>{errors.plant}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: tokens.colors.textSecondary }}>
            Centro de Destino
          </label>
          <select
            value={formData.distribution_center}
            onChange={(e) => setFormData({ ...formData, distribution_center: e.target.value })}
            className="px-3 py-2 rounded-md outline-none"
            style={{
              backgroundColor: tokens.colors.background,
              color: tokens.colors.textPrimary,
              border: `1px solid ${errors.distribution_center ? tokens.colors.error : tokens.colors.border}`,
            }}
          >
            <option value="">Seleccionar centro</option>
            {distributionCenters.map((center) => (
              <option key={center} value={center}>{center}</option>
            ))}
          </select>
          {errors.distribution_center && (
            <span className="text-xs" style={{ color: tokens.colors.error }}>{errors.distribution_center}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: tokens.colors.textSecondary }}>
            Producto
          </label>
          <select
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            className="px-3 py-2 rounded-md outline-none"
            style={{
              backgroundColor: tokens.colors.background,
              color: tokens.colors.textPrimary,
              border: `1px solid ${errors.product ? tokens.colors.error : tokens.colors.border}`,
            }}
          >
            <option value="">Seleccionar producto</option>
            {products.map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
          {errors.product && (
            <span className="text-xs" style={{ color: tokens.colors.error }}>{errors.product}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: tokens.colors.textSecondary }}>
            Cantidad
          </label>
          <input
            type="number"
            value={formData.quantity || ''}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 rounded-md outline-none"
            style={{
              backgroundColor: tokens.colors.background,
              color: tokens.colors.textPrimary,
              border: `1px solid ${errors.quantity ? tokens.colors.error : tokens.colors.border}`,
            }}
          />
          {errors.quantity && (
            <span className="text-xs" style={{ color: tokens.colors.error }}>{errors.quantity}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: tokens.colors.textSecondary }}>
            Fecha de Despacho
          </label>
          <input
            type="datetime-local"
            value={formData.dispatched_at.slice(0, 16)}
            onChange={(e) => setFormData({ ...formData, dispatched_at: new Date(e.target.value).toISOString() })}
            className="px-3 py-2 rounded-md outline-none"
            style={{
              backgroundColor: tokens.colors.background,
              color: tokens.colors.textPrimary,
              border: `1px solid ${errors.dispatched_at ? tokens.colors.error : tokens.colors.border}`,
            }}
          />
          {errors.dispatched_at && (
            <span className="text-xs" style={{ color: tokens.colors.error }}>{errors.dispatched_at}</span>
          )}
        </div>
      </div>

      <PrimaryButton type="submit" loading={loading}>
        Crear Despacho
      </PrimaryButton>
    </form>
  );
}