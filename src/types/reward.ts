export interface BackendReward {
  reward_id: number;
  name?: string;
  description?: string;
  category?: string;
  enav_id?: string;
  points_required: number;
  stock_available?: number;
  low_stock_threshold?: number;
  total_redeemed?: number;
  reward_code?: string;
  is_active?: boolean;
}

export interface FrontendReward {
  id: number;
  rewardName: string;
  description: string;
  category: string;
  pointsCost: number;
  stockAvailable: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  totalRedeemed: number;
  code: string;
  isActive: boolean;
}

export interface RewardFilters {
  search?: string;
  category?: string;
  lowStockOnly?: boolean;
}

export interface RewardApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RewardStats {
  total: number;
  active: number;
  lowStock: number;
}

export interface RewardCodeVerificationData {
  transId: string;
  code: string;
  status: string;
  points: number;
  patientId: string | null;
  patientName: string;
  rewardId: number | null;
  rewardName: string;
  transDate: string | null;
  validatedByEnavId: string | null;
  isValid: boolean;
  isFinalized: boolean;
}
