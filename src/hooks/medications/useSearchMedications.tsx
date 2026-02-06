import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { ApiResponse, BackendMedication } from './types';
import { API_BASE_URL, mapBackendToFrontend } from './utils';

export function useSearchMedications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMedications = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse<BackendMedication[]>>(
        `${API_BASE_URL}/medications/search`,
        { params: { q: query } },
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
