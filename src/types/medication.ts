export interface BackendMedication {
  medication_id: number;
  name: string;
  price: number;
  type: string;
  stock_qty: number;
  threshold_qty: number;
  enav_id?: string;
  created_at?: string;
  description?: string;
  dosage?: number;
}

export interface FrontendMedicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  description: string;
  dosage: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StatsData {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalStock: number;
}

export interface MedicationFilters {
  search?: string;
  type?: string;
  lowStockOnly?: boolean;
  page?: number;
  limit?: number;
}
