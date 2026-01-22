import type { RegistrationCode } from '../components/RegistrationCodes/types';

// Helper to get today's date in MM/DD/YYYY format
const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Helper to get yesterday's date in MM/DD/YYYY format
const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const registrationCodes: RegistrationCode[] = [
  {
    id: '1',
    code: 'CODE-ACTIVE1',
    expiryDate: getTodayDate(),
    expiryTime: '23:59:59',
    isExpired: false,
  },
  {
    id: '2',
    code: 'CODE-ACTIVE2',
    expiryDate: getTodayDate(),
    expiryTime: '23:59:59',
    isExpired: false,
  },
  {
    id: '3',
    code: 'CODE-ACTIVE3',
    expiryDate: getTodayDate(),
    expiryTime: '23:59:59',
    isExpired: false,
  },
  {
    id: '4',
    code: 'CODE-ACTIVE1',
    expiryDate: getTodayDate(),
    expiryTime: '23:59:59',
    isExpired: false,
  },
  {
    id: '5',
    code: 'CODE-ACTIVE2',
    expiryDate: getTodayDate(),
    expiryTime: '23:59:59',
    isExpired: false,
  },
];
