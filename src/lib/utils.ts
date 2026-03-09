import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number): string {
  const fixed = amount.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedInteger}.${decimal}`;
}

export function formatDiagnosis(
  diagnosis: string | Record<string, boolean> | unknown,
): string {
  // If it's already a string, return it
  if (typeof diagnosis === 'string') {
    return diagnosis || 'No diagnosis provided';
  }

  // If it's an object (diagnosis object with boolean values)
  if (diagnosis && typeof diagnosis === 'object') {
    const diagnosisObj = diagnosis as Record<string, boolean>;
    const conditions = Object.entries(diagnosisObj)
      .filter(([, value]) => value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ');

    return conditions || 'No diagnosis provided';
  }

  // Fallback for null/undefined
  return 'No diagnosis provided';
}
