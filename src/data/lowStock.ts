import type { LowStockItem } from '../components/low-stock/type';

export const lowStockItems: LowStockItem[] = [
  // Hypertension Medications
  {
    medicine: 'Losartan 50mg',
    category: 'Hypertension',
    current: 120,
    minStock: 150,
    status: 'Low',
  },
  {
    medicine: 'Amlodipine 5mg',
    category: 'Hypertension',
    current: 65,
    minStock: 120,
    status: 'Low',
  },
  {
    medicine: 'Lisinopril 10mg',
    category: 'Hypertension',
    current: 25,
    minStock: 80,
    status: 'Very Low',
  },
  {
    medicine: 'Hydrochlorothiazide 25mg',
    category: 'Hypertension',
    current: 90,
    minStock: 120,
    status: 'Low',
  },

  // Diabetes Medications
  {
    medicine: 'Metformin 850mg',
    category: 'Diabetes',
    current: 85,
    minStock: 100,
    status: 'Low',
  },
  {
    medicine: 'Gliclazide 80mg',
    category: 'Diabetes',
    current: 45,
    minStock: 80,
    status: 'Low',
  },
  {
    medicine: 'Glimepiride 2mg',
    category: 'Diabetes',
    current: 30,
    minStock: 60,
    status: 'Very Low',
  },
  {
    medicine: 'Insulin Glargine',
    category: 'Diabetes',
    current: 15,
    minStock: 40,
    status: 'Very Low',
  },
];
