import { useState } from 'react';
import { toast } from 'sonner';
import { registrationCodes } from '@/data/registrationCodes';
import type { RegistrationCode } from '../components/RegistrationCodes/types';

export function useRegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCode[]>(registrationCodes);

  const generateCode = () => {
    const newCode: RegistrationCode = {
      id: crypto.randomUUID(),
      code: `CODE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      expiryDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      expiryTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      isExpired: false,
    };

    setCodes([newCode, ...codes]);
    toast.success('New registration code generated!');
  };

  return {
    codes,
    generateCode,
  };
}
