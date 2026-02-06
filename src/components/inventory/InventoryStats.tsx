import { useEffect } from 'react';
import { Package, AlertTriangle, AlertCircle, BoxesIcon } from 'lucide-react';
import { StatsCard } from '../ui/stats-card';
import { useMedicationStats } from '@/hooks/medications/useMedicationStats';
import { InventoryStatsSkeleton } from '../skeleton/InventoryStatsSkeleton';

interface InventoryStatsProps {
  refreshTrigger?: number;
}

export function InventoryStats({ refreshTrigger }: InventoryStatsProps) {
  const { stats, loading, refetch } = useMedicationStats();

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  if (loading) {
    return <InventoryStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Medicines"
        value={stats.total}
        icon={<Package />}
        iconBgClassName="bg-blue-50"
        iconColorClassName="text-blue-500"
        description="Different types"
      />
      <StatsCard
        title="Low Stock"
        value={stats.lowStock}
        icon={<AlertTriangle />}
        iconBgClassName="bg-orange-50"
        iconColorClassName="text-orange-500"
        description="Below threshold"
      />
      <StatsCard
        title="Out of Stock"
        value={stats.outOfStock}
        icon={<AlertCircle />}
        iconBgClassName="bg-red-50"
        iconColorClassName="text-red-500"
        description="Zero stock items"
      />
      <StatsCard
        title="Total Stock"
        value={stats.totalStock}
        icon={<BoxesIcon />}
        iconBgClassName="bg-green-50"
        iconColorClassName="text-green-500"
        description="Total units"
      />
    </div>
  );
}
