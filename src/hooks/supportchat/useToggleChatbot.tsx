import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/reward.utils';

export const useToggleChatbot = () => {
  const [loading, setLoading] = useState(false);

  const toggleChatbot = async (chatId: string, chatbot_active: boolean) => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Access token is missing. Please log in again.';
        toast.error(message);
        return { success: false, error: message };
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/enavigator/supportChat/${chatId}/chatbot`,
        { chatbot_active },
        { headers },
      );

      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message || 'Failed to toggle chatbot';

      console.error('Toggle chatbot error:', errorMessage);
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { toggleChatbot, loading };
};
