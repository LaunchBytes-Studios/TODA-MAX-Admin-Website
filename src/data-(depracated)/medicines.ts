export interface Medicine {
  id: number;
  name: string;
  category: string;
  description?: string;
  dosage?: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}
