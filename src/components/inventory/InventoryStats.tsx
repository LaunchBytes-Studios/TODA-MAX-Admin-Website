import { useEffect } from 'react';
import { StatsCard } from '../ui/stats-card';
import { useMedicationStats } from '@/hooks/useMedications';
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
        description="Different types"
      />
      <StatsCard
        title="Low Stock"
        value={stats.lowStock}
        className=""
        description="Below threshold"
      />
      <StatsCard
        title="Out of Stock"
        value={stats.outOfStock}
        className=""
        description="Zero stock items"
      />
      <StatsCard
        title="Total Stock"
        value={stats.totalStock}
        className=""
        description="Total units"
      />
    </div>
  );
}
