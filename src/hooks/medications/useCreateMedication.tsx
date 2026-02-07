import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type {
  ApiResponse,
  BackendMedication,
  FrontendMedicine,
} from '@/types/medication';
import {
  API_BASE_URL,
  mapBackendToFrontend,
} from '../../utils/medication.utils';

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

      const backendData = {
        name: medicationData.name,
        price: medicationData.price,
        type: medicationData.category,
        stock_qty: medicationData.stock,
        threshold_qty: medicationData.lowStockThreshold,
        description: medicationData.description,
        dosage: medicationData.dosage,
        enav_id: '5e619edc-487a-42d6-af08-880c70a13a86',
      };
      console.log('Sending data to backend:', backendData);
      const response = await axios.post<ApiResponse<BackendMedication>>(
        `${API_BASE_URL}/medications`,
        backendData,
      );
      console.log('Backend response:', response.data);
      if (response.data.success) {
        toast.success('Medicine added successfully');
        return {
          success: true,
          data: mapBackendToFrontend(response.data.data),
        };
      }

      throw new Error(response.data.message);
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
