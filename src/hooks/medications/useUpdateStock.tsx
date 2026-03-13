import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse, BackendMedication } from '@/types/medication';
import { API_BASE_URL, mapBackendToFrontend } from '@/utils/medication.utils';

export function useUpdateStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStock = async (id: number, stock: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        return {
          success: false,
          error: message,
        };
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await axios.patch<ApiResponse<BackendMedication>>(
        `${API_BASE_URL}/medications/${id}/stock`,
        { stock_qty: stock },
        { headers },
      );

      if (response.data.success) {
        toast.success('Stock updated successfully');
        return {
          success: true,
          data: mapBackendToFrontend(response.data.data),
        };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to update stock';
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

  return { updateStock, loading, error };
}
