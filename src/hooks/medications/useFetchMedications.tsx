import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type {
  ApiResponse,
  BackendMedication,
  FrontendMedicine,
  MedicationFilters,
} from './types';
import { API_BASE_URL, mapBackendToFrontend } from './utils';

export function useFetchMedications(filters?: MedicationFilters) {
  const [medications, setMedications] = useState<FrontendMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchMedications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<BackendMedication[]>>(
        `${API_BASE_URL}/medications`,
        { params: filters },
      );

      if (response.data.success) {
        const mappedData = response.data.data.map(mapBackendToFrontend);

        setMedications(mappedData);
        setMeta(
          response.data.meta || {
            total: mappedData.length,
            page: 1,
            limit: mappedData.length,
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
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to fetch medications';
      setError(errorMsg);
      toast.error(errorMsg);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return {
    medications,
    loading,
    error,
    meta,
    refetch: fetchMedications,
  };
}
