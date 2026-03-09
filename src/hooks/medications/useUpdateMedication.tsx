import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse, BackendMedication } from '@/types/medication';
import { API_BASE_URL, mapBackendToFrontend } from '@/utils/medication.utils';

interface UpdateMedicationData {
  name?: string;
  category?: string;
  stock?: number;
  lowStockThreshold?: number;
  dosage?: number;
  price?: number;
  description?: string;
}

export function useUpdateMedication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMedication = async (
    id: number,
    updateData: UpdateMedicationData,
  ) => {
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

      const backendData: Record<string, unknown> = {};
      if (updateData.name !== undefined) backendData.name = updateData.name;
      if (updateData.category !== undefined)
        backendData.type = updateData.category;
      if (updateData.stock !== undefined)
        backendData.stock_qty = updateData.stock;
      if (updateData.lowStockThreshold !== undefined)
        backendData.threshold_qty = updateData.lowStockThreshold;
      if (updateData.dosage !== undefined)
        backendData.dosage = updateData.dosage;
      if (updateData.price !== undefined) backendData.price = updateData.price;
      if (updateData.description !== undefined)
        backendData.description = updateData.description;

      const response = await axios.put<ApiResponse<BackendMedication>>(
        `${API_BASE_URL}/medications/${id}`,
        backendData,
        { headers },
      );

      if (response.data.success) {
        return {
          success: true,
          data: mapBackendToFrontend(response.data.data),
        };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMsg =
        axiosError.response?.data?.message || 'Failed to update medication';
      setError(errorMsg);
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
