import { useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import type { RegistrationCode } from '../components/RegistrationCodes/types';

export function useRegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all registration codes from backend
  const fetchRegistrationCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await axios.get(
        `${url}/enavigator/get/RegistrationCode`,
        { headers },
      );

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
                status: item.status,
                enavId: item.enav_id,
                createdAt: item.created_at,
                usedAt: item.used_at,
                expiryTime,
                isExpired,
              };
            },
          )
        : [];

      // Delete expired codes
      const expiredCodes = mappedCodes.filter((code) => code.isExpired);
      if (expiredCodes.length > 0) {
        for (const expired of expiredCodes) {
          try {
            await axios.delete(`${url}/enavigator/delete/RegistrationCode`, {
              params: { codeId: expired.id },
              headers,
            });
          } catch (deleteErr) {
            // Optionally handle delete error
          }
        }
        // Remove expired codes from the list
        setCodes(mappedCodes.filter((code) => !code.isExpired));
      } else {
        setCodes(mappedCodes);
      }
    } catch (err) {
      let message = 'Failed to fetch registration codes.';
      if (err instanceof Error) {
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
      const url = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      await axios.post(
        `${url}/enavigator/generate/RegistrationCode`,
        {},
        { headers },
      );
      toast.success('Registration code generated successfully!');
      await fetchRegistrationCodes();
    } catch (err) {
      let message = 'Failed to generate registration code.';
      if (err instanceof Error) {
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
