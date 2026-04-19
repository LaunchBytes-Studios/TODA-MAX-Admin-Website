import type {
  BackendReward,
  FrontendReward,
  RewardStats,
} from '@/types/reward';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const DEFAULT_LOW_STOCK_THRESHOLD = 10;

export const formatRewardCode = (id: number, backendCode?: string) =>
  backendCode || `RW${String(id).padStart(3, '0')}`;

export const mapBackendRewardToFrontend = (
  backendReward: BackendReward,
): FrontendReward => {
  const stockAvailable = backendReward.stock_available ?? 0;
  const lowStockThreshold =
    backendReward.low_stock_threshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

  return {
    id: backendReward.reward_id,
    rewardName: backendReward.name || 'Unnamed Reward',
    description: backendReward.description ?? '',
    category: backendReward.category ?? 'Discount',
    pointsCost: backendReward.points_required,
    stockAvailable,
    lowStockThreshold,
    isLowStock: stockAvailable > 0 && stockAvailable <= lowStockThreshold,
    totalRedeemed: backendReward.total_redeemed ?? 0,
    code: formatRewardCode(backendReward.reward_id, backendReward.reward_code),
    isActive: backendReward.is_active ?? true,
  };
};

export const calculateRewardStats = (
  rewards: FrontendReward[],
): RewardStats => {
  return {
    total: rewards.length,
    active: rewards.filter((reward) => reward.isActive).length,
    lowStock: rewards.filter((reward) => reward.isLowStock).length,
  };
};
