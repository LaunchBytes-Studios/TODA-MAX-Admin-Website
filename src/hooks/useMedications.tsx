import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface BackendMedication {
  medication_id: number;
  name: string;
  price: number;
  type: string;
  stock_qty: number;
  threshold_qty: number;
  enav_id?: string;
  created_at?: string;
  description?: string;
  dosage?: string;
}

export interface FrontendMedicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

const API_BASE_URL = 'http://localhost:3000';

const mapBackendToFrontend = (
  backendMed: BackendMedication,
): FrontendMedicine => ({
  id: backendMed.medication_id,
  name: backendMed.name,
  category: backendMed.type,
  price: backendMed.price,
  stock: backendMed.stock_qty,
  lowStockThreshold: backendMed.threshold_qty,
  isLowStock: backendMed.stock_qty <= backendMed.threshold_qty,
});

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface StatsData {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalStock: number;
}

export function useMedications(filters?: {
  search?: string;
  type?: string;
  lowStockOnly?: boolean;
  page?: number;
  limit?: number;
}) {
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

export function useCreateMedication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface CreateMedicationData extends Omit<
    FrontendMedicine,
    'id' | 'isLowStock'
  > {
    price: number;
  }

  const createMedication = async (medicationData: CreateMedicationData) => {
    try {
      setLoading(true);
      setError(null);

      const backendData = {
        name: medicationData.name,
        price: medicationData.price,
        type: medicationData.category,
        stock_qty: medicationData.stock,
        threshold_qty: medicationData.lowStockThreshold,
        enav_id: '5e619edc-487a-42d6-af08-880c70a13a86',
      };

      const response = await axios.post<ApiResponse<BackendMedication>>(
        `${API_BASE_URL}/medications`,
        backendData,
      );

      if (response.data.success) {
        toast.success('Medicine added successfully');
        return {
          success: true,
          data: mapBackendToFrontend(response.data.data),
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to create medication';
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

  return { createMedication, loading, error };
}

export function useUpdateMedication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface UpdateMedicationData {
    name?: string;
    category?: string;
    stock?: number;
    lowStockThreshold?: number;
  }

  const updateMedication = async (
    id: number,
    updateData: UpdateMedicationData,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const backendData: Record<string, unknown> = {};
      if (updateData.name !== undefined) backendData.name = updateData.name;
      if (updateData.category !== undefined)
        backendData.type = updateData.category;
      if (updateData.stock !== undefined)
        backendData.stock_qty = updateData.stock;
      if (updateData.lowStockThreshold !== undefined)
        backendData.threshold_qty = updateData.lowStockThreshold;

      const response = await axios.put<ApiResponse<BackendMedication>>(
        `${API_BASE_URL}/medications/${id}`,
        backendData,
      );

      if (response.data.success) {
        toast.success('Medicine updated successfully');
        return {
          success: true,
          data: mapBackendToFrontend(response.data.data),
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to update medication';
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

  return { updateMedication, loading, error };
}

export function useUpdateStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStock = async (id: number, stock: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.patch<ApiResponse<BackendMedication>>(
        `${API_BASE_URL}/medications/${id}/stock`,
        { stock_qty: stock },
      );

      if (response.data.success) {
        toast.success('Stock updated successfully');
        return {
          success: true,
          data: mapBackendToFrontend(response.data.data),
        };
      } else {
        throw new Error(response.data.message);
      }
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
      } else {
        throw new Error(response.data.message);
      }
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
      } else {
        throw new Error(response.data.message);
      }
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
