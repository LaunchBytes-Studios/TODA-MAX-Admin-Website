import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/reward.utils';
import type { ChatSessionWithPatient } from '@/types/chat';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useHydrateChatSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrateChatSession = async (chatId: string) => {
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

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get<ApiResponse<ChatSessionWithPatient>>(
        `${API_BASE_URL}/enavigator/supportChat/${chatId}`,
        { headers },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to hydrate session');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message || 'Failed to hydrate chat session';

      setError(errorMessage);
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { hydrateChatSession, loading, error };
}
