import { Card, CardContent } from '../ui/card';
import { useMedicationStats } from '@/hooks/useMedications';
import { InventoryStatsSkeleton } from './InventoryStatsSkeleton';

export function InventoryStats() {
  const { stats, loading } = useMedicationStats();

  if (loading) {
    return <InventoryStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600">Total Medicines</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Different types</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600">Low Stock</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {stats.lowStock}
          </p>
          <p className="text-xs text-gray-500 mt-1">Below threshold</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {stats.outOfStock}
          </p>
          <p className="text-xs text-gray-500 mt-1">Zero stock items</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600">Total Stock</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalStock}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total units</p>
        </CardContent>
      </Card>
    </div>
  );
}
