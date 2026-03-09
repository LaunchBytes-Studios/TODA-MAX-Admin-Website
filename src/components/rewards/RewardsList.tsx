import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MedicineCardSkeleton from '@/components/skeleton/MedicineCardSkeleton';
import type { FrontendReward } from '@/types/reward';
import RewardCard from '@/components/rewards/RewardCard';

interface RewardsListProps {
  rewards: FrontendReward[];
  loading: boolean;
  searchTerm: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddClick: () => void;
}

export function RewardsList({
  rewards,
  loading,
  searchTerm,
  onEdit,
  onDelete,
  onAddClick,
}: RewardsListProps) {
  if (loading && rewards.length > 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <MedicineCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (loading && rewards.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <MedicineCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-gray-400 mb-2">
          <Search className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No rewards found
        </h3>
        <p className="text-gray-600">
          {searchTerm
            ? `No rewards found for "${searchTerm}"`
            : 'No rewards in this category. Add your first reward!'}
        </p>
        {!searchTerm && (
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={onAddClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Reward
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          id={reward.id}
          rewardName={reward.rewardName}
          description={reward.description}
          category={reward.category}
          pointsCost={reward.pointsCost}
          totalRedeemed={reward.totalRedeemed}
          code={reward.code}
          stockAvailable={reward.stockAvailable}
          isLowStock={reward.isLowStock}
          isActive={reward.isActive}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
