import { useEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';
import { RewardStatsSkeleton } from '@/components/skeleton/RewardStatsSkeleton';
import { useRewardStats } from '@/hooks/rewards/useRewardStats';

interface RewardStatsProps {
  refreshTrigger?: number;
}

export function RewardStats({ refreshTrigger }: RewardStatsProps) {
  const { stats, loading, refetch } = useRewardStats();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (refreshTrigger !== undefined) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  if (loading) {
    return <RewardStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard
        title="Active Rewards"
        value={stats.active}
        icon={<ShieldCheck />}
        iconBgClassName="bg-green-50"
        iconColorClassName="text-green-600"
        description="Currently available"
        className="min-h-35"
      />
      <StatsCard
        title="Low Stock Alert"
        value={stats.lowStock}
        icon={<AlertTriangle />}
        iconBgClassName="bg-orange-50"
        iconColorClassName="text-orange-500"
        description="Needs replenishment"
        className="min-h-35"
      />
    </div>
  );
}
