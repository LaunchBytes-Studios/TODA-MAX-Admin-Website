import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { api } from '@/api/client';

export function useGenerateRegistrationCodes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRegistrationCode = async (
    onSuccess?: () => void | Promise<void>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        return;
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      try {
        await api.post(
          `/enavigator/registrationCodes/maintenance`,
          {},
          { headers, params: { confirm: true } },
        );
      } catch (maintenanceErr) {
        console.warn('Maintenance failed:', maintenanceErr);
      }

      await api.post('/enavigator/registrationCodes/generate', {}, { headers });
      toast.success('Registration code generated successfully!');

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      let message = 'Failed to generate registration code.';
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data && err.response.data.error) {
          message = err.response.data.error;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = String((err as { message: unknown }).message);
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateRegistrationCode,
  };
}
