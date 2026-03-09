import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type {
  BackendReward,
  RewardApiResponse,
  RewardStats,
} from '@/types/reward';
import {
  API_BASE_URL,
  calculateRewardStats,
  mapBackendRewardToFrontend,
} from '@/utils/reward.utils';

export function useRewardStats() {
  const [stats, setStats] = useState<RewardStats>({
    total: 0,
    active: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        return;
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await axios.get<RewardApiResponse<BackendReward[]>>(
        `${API_BASE_URL}/rewards`,
        { headers },
      );

      if (response.data.success) {
        const mappedRewards = response.data.data.map(
          mapBackendRewardToFrontend,
        );
        setStats(calculateRewardStats(mappedRewards));
        setError(null);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to fetch reward stats';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
