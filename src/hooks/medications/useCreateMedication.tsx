import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type {
  ApiResponse,
  BackendMedication,
  FrontendMedicine,
} from '@/types/medication';
import { API_BASE_URL, mapBackendToFrontend } from '@/utils/medication.utils';

interface CreateMedicationData extends Omit<
  FrontendMedicine,
  'id' | 'isLowStock'
> {
  price: number;
  dosage: number;
}

export function useCreateMedication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMedication = async (medicationData: CreateMedicationData) => {
    try {
      setLoading(true);
      setError(null);

      let resolvedEnavId: string | undefined;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          resolvedEnavId = user?.enav_id || user?.userId;
        } catch (err) {
          console.error('Failed to parse user from localStorage:', err);
        }
      }

      const backendData = {
        name: medicationData.name,
        price: medicationData.price,
        type: medicationData.category,
        stock_qty: medicationData.stock,
        threshold_qty: medicationData.lowStockThreshold,
        description: medicationData.description,
        dosage: medicationData.dosage,
        ...(resolvedEnavId ? { enav_id: resolvedEnavId } : {}),
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
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const errorMsg =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        'Failed to create medication';
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
