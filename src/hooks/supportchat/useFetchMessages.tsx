import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/reward.utils';
import type { Message } from '@/types/chat';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useFetchMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMessages = async (chatId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        setError(message);
        toast.error(message);
        return { success: false, error: message };
      }

      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get<ApiResponse<Message[]>>(
        `${API_BASE_URL}/enavigator/supportChat/${chatId}/messages`,
        { headers },
      );

      if (response.data.success) {
        const normalized = response.data.data.map(
          (msg) =>
            ({
              ...msg,
              created_at: new Date(msg.created_at),
            }) as Message,
        );

        return {
          success: true,
          data: normalized,
        };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message || 'Failed to fetch messages';

      setError(errorMessage);
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { getMessages, loading, error };
}
