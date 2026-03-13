import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { api } from '@/api/client';
import type {
  RewardApiResponse,
  RewardCodeVerificationData,
} from '@/types/reward';

export function useRewardCodeVerification() {
  const [verification, setVerification] =
    useState<RewardCodeVerificationData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const getTokenOrFail = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Access token is missing. Please log in again.');
      return null;
    }

    return token;
  };

  const verifyCode = async (code: string) => {
    setIsVerifying(true);
    try {
      const token = getTokenOrFail();
      if (!token) {
        return null;
      }

      const response = await api.get<
        RewardApiResponse<RewardCodeVerificationData>
      >('/enavigator/rewardCodes/verify', {
        params: { code: code.trim() },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success || !response.data.data) {
        toast.error(response.data.message || 'Verification failed');
        return null;
      }

      setVerification(response.data.data);
      toast.success(response.data.message || 'Code verified');
      return response.data.data;
    } catch (error: unknown) {
      let message = 'Failed to verify reward code';
      if (axios.isAxiosError(error)) {
        message =
          (error.response?.data as { message?: string } | undefined)?.message ||
          error.message ||
          message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const finalizeCode = async (code: string) => {
    setIsRedeeming(true);
    try {
      const token = getTokenOrFail();
      if (!token) {
        return null;
      }

      const response = await api.post<
        RewardApiResponse<RewardCodeVerificationData>
      >(
        '/enavigator/rewardCodes/finalize',
        { code: code.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data.success || !response.data.data) {
        toast.error(response.data.message || 'Redemption failed');
        return null;
      }

      setVerification(response.data.data);
      toast.success(response.data.message || 'Reward redeemed');
      return response.data.data;
    } catch (error: unknown) {
      let message = 'Failed to redeem reward code';
      if (axios.isAxiosError(error)) {
        message =
          (error.response?.data as { message?: string } | undefined)?.message ||
          error.message ||
          message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      return null;
    } finally {
      setIsRedeeming(false);
    }
  };

  const clearVerification = () => {
    setVerification(null);
  };

  return {
    verification,
    isVerifying,
    isRedeeming,
    verifyCode,
    finalizeCode,
    clearVerification,
  };
}
