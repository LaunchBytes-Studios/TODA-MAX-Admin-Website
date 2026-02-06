import { useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import type { RegistrationCodesProps } from '../components/dashboard/RegistrationCodesCard';
import { api } from '@/api/client';

export function useRegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCodesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all registration codes from backend
  const fetchRegistrationCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await api.get(`/enavigator/get/registrationCode`, {
        headers,
      });

      let data = response.data;
      if (data && !Array.isArray(data)) {
        data = [data];
      }
      const mappedCodes = Array.isArray(data)
        ? data.map(
            (item: {
              code_id: string;
              code: string;
              expires_at?: string;
              status?: string;
              enav_id?: string;
              created_at?: string;
              used_at?: string;
            }) => {
              const expiryTime = item.expires_at
                ? String(new Date(item.expires_at).getTime())
                : '';
              const isExpired = expiryTime
                ? Number(expiryTime) < Date.now()
                : false;
              return {
                id: item.code_id,
                code: item.code,
                expiryDate: item.expires_at
                  ? new Date(item.expires_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : '',
                status: item.status ?? '',
                enavId: item.enav_id,
                createdAt: item.created_at,
                usedAt: item.used_at,
                expiryTime,
                isExpired,
                expires_at: item.expires_at
                  ? new Date(item.expires_at)
                  : new Date(0),
                created_at: item.created_at
                  ? new Date(item.created_at)
                  : new Date(0),
                used_at: item.used_at ? new Date(item.used_at) : null,
              };
            },
          )
        : [];
      // Backend maintenance handles cleanup; filter defensively for display
      const activeUnusedCodes = mappedCodes.filter(
        (code) =>
          code.status === 'active' && !code.isExpired && code.used_at === null,
      );
      setCodes(activeUnusedCodes);
    } catch (err) {
      let message = 'Failed to fetch registration codes.';
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
  }, []);

  // Generate a registration code
  const generateRegistrationCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Run maintenance before generating to clean up old codes
      try {
        await api.post(
          `/enavigator/maintenance/registrationCode`,
          {},
          { headers, params: { confirm: true } },
        );
      } catch (maintenanceErr) {
        console.warn('Maintenance failed:', maintenanceErr);
      }

      await api.post(`/enavigator/generate/registrationCode`, {}, { headers });
      toast.success('Registration code generated successfully!');
      await fetchRegistrationCodes();
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
    codes,
    loading,
    error,
    fetchRegistrationCodes,
    generateRegistrationCode,
  };
}
