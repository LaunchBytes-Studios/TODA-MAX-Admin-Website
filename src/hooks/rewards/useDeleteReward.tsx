import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { RewardApiResponse } from '@/types/reward';
import { API_BASE_URL } from '@/utils/reward.utils';

export function useDeleteReward() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReward = async (id: number) => {
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

      const response = await axios.delete<RewardApiResponse>(
        `${API_BASE_URL}/rewards/${id}`,
        { headers },
      );

      if (response.data.success) {
        toast.success('Reward deleted successfully');
        return { success: true };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to delete reward';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { deleteReward, loading, error };
}
