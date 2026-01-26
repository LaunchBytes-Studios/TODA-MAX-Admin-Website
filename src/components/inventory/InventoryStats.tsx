import { Card, CardContent } from '../ui/card';
import { useMedicationStats } from '@/hooks/useMedications';

interface InventoryStatsProps {
  total?: number;
  lowStock?: number;
  outOfStock?: number;
  totalStock?: number;
}

export function InventoryStats(props: InventoryStatsProps) {
  const { stats, loading } = useMedicationStats();

  const displayStats = {
    total: props.total !== undefined ? props.total : stats.total,
    lowStock: props.lowStock !== undefined ? props.lowStock : stats.lowStock,
    outOfStock:
      props.outOfStock !== undefined ? props.outOfStock : stats.outOfStock,
    totalStock:
      props.totalStock !== undefined ? props.totalStock : stats.totalStock,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div>
            <p className="text-sm text-gray-600">Total Medicines</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : displayStats.total}
            </p>
            <p className="text-xs text-gray-500 mt-1">Different types</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div>
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {loading ? '...' : displayStats.lowStock}
            </p>
            <p className="text-xs text-gray-500 mt-1">Below threshold</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div>
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {loading ? '...' : displayStats.outOfStock}
            </p>
            <p className="text-xs text-gray-500 mt-1">Zero stock items</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div>
            <p className="text-sm text-gray-600">Total Stock</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {loading ? '...' : displayStats.totalStock}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total units</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
