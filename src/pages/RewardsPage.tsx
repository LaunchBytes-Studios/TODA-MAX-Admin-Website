import { useDeferredValue, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AddRewardForm from '@/components/rewards/AddRewardForm';
import { RewardCodeVerificationCard } from '@/components/rewards/RewardCodeVerificationCard';
import DeleteRewardModal from '@/components/rewards/DeleteRewardModal';
import EditRewardForm from '@/components/rewards/EditRewardForm';
import { RewardStats } from '@/components/rewards/RewardStats';
import { RewardsList } from '@/components/rewards/RewardsList';
import { SearchAndFilterBar } from '@/components/rewards/SearchAndFilterBar';
import { useCreateReward } from '@/hooks/rewards/useCreateReward';
import { useDeleteReward } from '@/hooks/rewards/useDeleteReward';
import { useFetchRewards } from '@/hooks/rewards/useFetchRewards';
import { REWARDS_FILTER_GROUPS } from '@/constants/tabs';
import type { FrontendReward } from '@/types/reward';

const GROUP_ALL_PREFIX = 'all:';
const QUANTITY_FILTER_IDS = ['out-of-stock', 'low-stock', 'in-stock'];

export function RewardsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<FrontendReward | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<FrontendReward | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const deferredSearch = useDeferredValue(searchTerm);

  const filters = useMemo(() => {
    const trimmedSearch = deferredSearch.trim();

    return {
      search: trimmedSearch || undefined,
    };
  }, [deferredSearch]);

  const {
    rewards,
    loading: isLoadingRewards,
    refetch,
  } = useFetchRewards(filters);
  const { createReward } = useCreateReward();
  const { deleteReward } = useDeleteReward();

  const isSearching = searchTerm.trim() !== '' && searchTerm !== deferredSearch;
  const isContentLoading = isLoadingRewards || isSearching;

  const selectedCategoryFilters = useMemo(
    () =>
      selectedFilters.filter(
        (filterId) =>
          !filterId.startsWith(GROUP_ALL_PREFIX) &&
          !QUANTITY_FILTER_IDS.includes(filterId),
      ),
    [selectedFilters],
  );

  const selectedQuantityFilters = useMemo(
    () =>
      selectedFilters.filter(
        (filterId) =>
          !filterId.startsWith(GROUP_ALL_PREFIX) &&
          QUANTITY_FILTER_IDS.includes(filterId),
      ),
    [selectedFilters],
  );

  const filteredRewards = useMemo(() => {
    return rewards.filter((reward) => {
      const matchesType =
        selectedCategoryFilters.length === 0 ||
        selectedCategoryFilters.includes(reward.category.toLowerCase());

      const isOutOfStock = reward.stockAvailable === 0;
      const isLowStock =
        reward.stockAvailable > 0 &&
        reward.stockAvailable <= reward.lowStockThreshold;
      const isInStock = reward.stockAvailable > reward.lowStockThreshold;
      const matchesQuantity =
        selectedQuantityFilters.length === 0 ||
        (selectedQuantityFilters.includes('out-of-stock') && isOutOfStock) ||
        (selectedQuantityFilters.includes('low-stock') && isLowStock) ||
        (selectedQuantityFilters.includes('in-stock') && isInStock);

      return matchesType && matchesQuantity;
    });
  }, [rewards, selectedCategoryFilters, selectedQuantityFilters]);

  const handleEdit = (id: number) => {
    const reward = rewards.find((item) => item.id === id);
    if (reward) {
      setSelectedReward(reward);
      setIsEditFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const reward = rewards.find((item) => item.id === id);
    if (reward) {
      setRewardToDelete(reward);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!rewardToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteReward(rewardToDelete.id);
      if (result.success) {
        await refetch();
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setRewardToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRewardToDelete(null);
  };

  const handleAddReward = async (newReward: {
    rewardName: string;
    description: string;
    category: string;
    pointsCost: number;
    stockAvailable: number;
    lowStockThreshold: number;
    isActive: boolean;
  }) => {
    const result = await createReward(newReward);
    if (result.success) {
      await refetch();
      setRefreshTrigger((prev) => prev + 1);
      setIsAddFormOpen(false);
    }
  };

  const handleUpdateReward = async () => {
    try {
      await refetch();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error refreshing rewards:', error);
      toast.error('Failed to refresh rewards');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Rewards Catalog</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start">
          <div className="xl:col-span-3">
            <RewardStats refreshTrigger={refreshTrigger} />
          </div>
          <div className="xl:col-span-2">
            <RewardCodeVerificationCard />
          </div>
        </div>

        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          filterOptionGroups={REWARDS_FILTER_GROUPS}
          onAddClick={() => setIsAddFormOpen(true)}
          isLoading={isSearching}
        />

        <RewardsList
          rewards={filteredRewards}
          loading={isContentLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={() => setIsAddFormOpen(true)}
        />

        <AddRewardForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onAddReward={handleAddReward}
        />

        <EditRewardForm
          isOpen={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedReward(null);
          }}
          reward={selectedReward}
          onUpdateReward={handleUpdateReward}
        />

        <DeleteRewardModal
          isOpen={isDeleteModalOpen}
          rewardName={rewardToDelete?.rewardName || null}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}

export default RewardsPage;
