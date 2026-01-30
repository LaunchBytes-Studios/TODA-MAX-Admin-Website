import { useCallback, useState } from 'react';
import { api } from '@/api/client';
import { toast } from 'sonner';
import axios, { isAxiosError } from 'axios';

export interface Announcement {
  announce_id: string;
  message: string;
  announce_date: string;
  type: string;
  enav_id: string;
}

export function useAnnouncement() {
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
      const response = await api.get(`/enavigator/get/announcement`, {
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

  // Post a new announcement
  const postAnnouncement = useCallback(
    async (message: string, enavId?: string) => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      // Try to get enavId from localStorage user if not provided
      let resolvedEnavId = enavId;
      if (!resolvedEnavId) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            resolvedEnavId = user?.enav_id || user?.userId;
          } catch (err) {
            console.error('Failed to parse user from localStorage:', err);
          }
        }
      }
      console.log('Posting announcement with enavId:', resolvedEnavId); // Debug log
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        setLoading(false);
        return null;
      }
      if (!resolvedEnavId) {
        const message = 'enavId is missing. Cannot post announcement.';
        setError(message);
        toast.error(message);
        setLoading(false);
        return null;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.post(
          `/enavigator/post/announcement?enavId=${resolvedEnavId}`,
          { message, type: 'general' },
          { headers: { ...headers, 'Content-Type': 'application/json' } },
        );
        toast.success('Announcement posted successfully!');
        // Optionally refresh announcements after posting
        await fetchAnnouncements();
        return response.data.announcement;
      } catch (err) {
        let message = 'Failed to post announcement.';
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.error) {
            message = err.response.data.error;
          } else if (err.message) {
            message = err.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        } else if (
          typeof err === 'object' &&
          err !== null &&
          'message' in err
        ) {
          message = String((err as { message: unknown }).message);
        }
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchAnnouncements],
  );

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    postAnnouncement,
  };
}
