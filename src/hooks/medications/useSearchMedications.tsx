import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse, BackendMedication } from '@/types/medication';
import { API_BASE_URL, mapBackendToFrontend } from '@/utils/medication.utils';

export function useSearchMedications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMedications = async (query: string) => {
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

      const response = await axios.get<ApiResponse<BackendMedication[]>>(
        `${API_BASE_URL}/medications/search`,
        { params: { q: query }, headers },
      );

      if (response.data.success) {
        const mappedData = response.data.data.map(mapBackendToFrontend);
        return {
          success: true,
          data: mappedData,
        };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to search medications';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  return { searchMedications, loading, error };
}
