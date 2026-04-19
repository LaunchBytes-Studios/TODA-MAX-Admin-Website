import { useCallback, useState } from 'react';
import { api } from '@/api/client';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export interface Announcement {
  announce_id: string;
  message: string;
  announce_date: string;
  type: string;
  enav_id: string;
}

export function useFetchAnnouncement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      const message = 'Access token is missing. Please log in again.';
      setError(message);
      toast.error(message);
      setLoading(false);
      return null;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get(`/enavigator/announcements`, {
        headers,
      });
      let data = response.data;
      if (data && !Array.isArray(data)) {
        data = [data];
      }
      setAnnouncements(data);
      return data;
    } catch (err) {
      let message = 'Failed to fetch announcements.';
      if (isAxiosError(err)) {
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
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
  };
}
