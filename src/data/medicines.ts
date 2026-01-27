export interface Medicine {
  id: number;
  name: string;
  category: string;
  description?: string;
  dosage?: string;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export const initialMedicines: Medicine[] = [
  {
    id: 1,
    name: 'Losartan',
    category: 'Cardiovascular',
    description: 'For high blood pressure (Hypertension)',
    dosage: '50mg',
    stock: 45,
    lowStockThreshold: 10,
    isLowStock: false,
  },
  {
    id: 2,
    name: 'Metformin',
    category: 'Diabetes',
    description: 'For type 2 diabetes',
    dosage: '500mg',
    stock: 15,
    lowStockThreshold: 20,
    isLowStock: true,
  },
];
