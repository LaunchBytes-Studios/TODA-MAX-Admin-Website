import { useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import type { RegistrationCodesProps } from '../../components/dashboard/RegistrationCodesCard';
import { api } from '@/api/client';

export function useFetchRegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCodesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all registration codes from backend
  const fetchRegistrationCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        setCodes([]);
        return;
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await api.get(`/enavigator/registrationCodes`, {
        headers,
      });

      let data = response.data;
      if (data && !Array.isArray(data)) {
        data = [data];
      }
      const mappedCodes = Array.isArray(data)
        ? data.map(
            (item: {
              code_id: number;
              code: string;
              expires_at?: string;
              status?: string;
              enav_id?: string;
              created_at?: string;
              used_at?: string;
            }) => {
              const expiresAt = item.expires_at
                ? new Date(item.expires_at)
                : new Date(0);
              const createdAt = item.created_at
                ? new Date(item.created_at)
                : new Date(0);
              const usedAt = item.used_at ? new Date(item.used_at) : null;

              return {
                id: item.code_id,
                code: item.code,
                status: item.status ?? '',
                expires_at: expiresAt,
                created_at: createdAt,
                used_at: usedAt,
              };
            },
          )
        : [];
      //  filter defensively for display
      const activeUnusedCodes = mappedCodes.filter(
        (code) =>
          code.status === 'active' &&
          !isNaN(code.expires_at.getTime()) &&
          code.expires_at.getTime() >= Date.now() &&
          code.used_at === null,
      );
      const sortedCodes = [...activeUnusedCodes].sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime(),
      );
      setCodes(sortedCodes);
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

  return {
    codes,
    loading,
    error,
    fetchRegistrationCodes,
  };
}
