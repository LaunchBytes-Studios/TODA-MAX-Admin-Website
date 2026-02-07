import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse } from '@/types/medication';
import { API_BASE_URL } from '../../utils/medication.utils';

export function useDeleteMedication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMedication = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete<ApiResponse>(
        `${API_BASE_URL}/medications/${id}`,
      );

      if (response.data.success) {
        toast.success('Medicine deleted successfully');
        return { success: true };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to delete medication';
      setError(errorMsg);
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  return { deleteMedication, loading, error };
}
