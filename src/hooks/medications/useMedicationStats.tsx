import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse, StatsData } from '@/types/medication';
import { API_BASE_URL } from '@/utils/medication.utils';

export function useMedicationStats() {
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<StatsData>>(
        `${API_BASE_URL}/medications/stats`,
      );

      if (response.data.success) {
        setStats(response.data.data);
        setError(null);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to fetch statistics';
      setError(errorMsg);
      toast.error(errorMsg);
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
