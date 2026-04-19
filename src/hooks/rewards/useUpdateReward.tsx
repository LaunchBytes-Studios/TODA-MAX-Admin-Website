import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { BackendReward, RewardApiResponse } from '@/types/reward';
import { API_BASE_URL, mapBackendRewardToFrontend } from '@/utils/reward.utils';

interface UpdateRewardPayload {
  rewardName?: string;
  description?: string;
  category?: string;
  pointsCost?: number;
  stockAvailable?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
}

export function useUpdateReward() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReward = async (id: number, payload: UpdateRewardPayload) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        return { success: false, error: message };
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const backendPayload: Record<string, unknown> = {};
      if (payload.rewardName !== undefined) {
        backendPayload.name = payload.rewardName;
      }
      if (payload.description !== undefined)
        backendPayload.description = payload.description;
      if (payload.category !== undefined)
        backendPayload.category = payload.category;
      if (payload.pointsCost !== undefined)
        backendPayload.points_required = payload.pointsCost;
      if (payload.stockAvailable !== undefined)
        backendPayload.stock_available = payload.stockAvailable;
      if (payload.lowStockThreshold !== undefined)
        backendPayload.low_stock_threshold = payload.lowStockThreshold;
      if (payload.isActive !== undefined)
        backendPayload.is_active = payload.isActive;

      const response = await axios.put<RewardApiResponse<BackendReward>>(
        `${API_BASE_URL}/rewards/${id}`,
        backendPayload,
        { headers },
      );

      if (response.data.success) {
        toast.success('Reward updated successfully');
        return {
          success: true,
          data: mapBackendRewardToFrontend(response.data.data),
        };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to update reward';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { updateReward, loading, error };
}
