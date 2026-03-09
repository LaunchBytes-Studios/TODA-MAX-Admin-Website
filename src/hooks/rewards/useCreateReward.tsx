import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { BackendReward, RewardApiResponse } from '@/types/reward';
import { API_BASE_URL, mapBackendRewardToFrontend } from '@/utils/reward.utils';

interface CreateRewardPayload {
  rewardName: string;
  description?: string;
  category: string;
  pointsCost: number;
  stockAvailable: number;
  lowStockThreshold: number;
  isActive: boolean;
}

export function useCreateReward() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReward = async (payload: CreateRewardPayload) => {
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

      let resolvedEnavId: string | undefined;
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          resolvedEnavId = user?.enav_id || user?.userId;
        } catch (parseError) {
          console.error('Failed to parse user from localStorage:', parseError);
        }
      }

      const backendPayload = {
        name: payload.rewardName,
        description: payload.description,
        category: payload.category,
        points_required: payload.pointsCost,
        stock_available: payload.stockAvailable,
        low_stock_threshold: payload.lowStockThreshold,
        is_active: payload.isActive,
        ...(resolvedEnavId ? { enav_id: resolvedEnavId } : {}),
      };

      const response = await axios.post<RewardApiResponse<BackendReward>>(
        `${API_BASE_URL}/rewards`,
        backendPayload,
        { headers },
      );

      if (response.data.success) {
        toast.success('Reward added successfully');
        return {
          success: true,
          data: mapBackendRewardToFrontend(response.data.data),
        };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to create reward';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createReward, loading, error };
}
