import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type {
  BackendReward,
  FrontendReward,
  RewardApiResponse,
  RewardFilters,
} from '@/types/reward';
import { API_BASE_URL, mapBackendRewardToFrontend } from '@/utils/reward.utils';

export function useFetchRewards(filters?: RewardFilters) {
  const [rewards, setRewards] = useState<FrontendReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        setRewards([]);
        return;
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await axios.get<RewardApiResponse<BackendReward[]>>(
        `${API_BASE_URL}/rewards`,
        { params: filters, headers },
      );

      if (response.data.success) {
        const mappedRewards = response.data.data.map(
          mapBackendRewardToFrontend,
        );
        setRewards(mappedRewards);
        setMeta(
          response.data.meta || {
            total: mappedRewards.length,
            page: 1,
            limit: mappedRewards.length,
            totalPages: 1,
          },
        );
        setError(null);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to fetch rewards';
      setError(errorMessage);
      setRewards([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return {
    rewards,
    loading,
    error,
    meta,
    refetch: fetchRewards,
  };
}
