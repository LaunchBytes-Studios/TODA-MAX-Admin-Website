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
