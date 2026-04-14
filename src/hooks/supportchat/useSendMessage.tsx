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

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (chatId: string, content: string) => {
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

      let resolvedEnavId: string | undefined;
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          resolvedEnavId = user?.enav_id || user?.userId;
        } catch (parseError) {
          console.error('Failed to parse user from localStorage:', parseError);
        }
      }

      const response = await axios.post<ApiResponse<Message>>(
        `${API_BASE_URL}/enavigator/supportChat/${chatId}/messages`,
        { content, senderId: resolvedEnavId },
        { headers },
      );

      if (response.data.success) {
        const msg = {
          ...response.data.data,
          created_at: new Date(response.data.data.created_at),
        };

        return { success: true, data: msg };
      }

      throw new Error(response.data.message);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message || 'Failed to send message';

      setError(errorMessage);
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
