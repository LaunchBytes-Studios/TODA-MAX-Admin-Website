import type { BackendMedication, FrontendMedicine } from '@/types/medication';

export const API_BASE_URL = 'http://localhost:3000';

export const mapBackendToFrontend = (
  backendMed: BackendMedication,
): FrontendMedicine => ({
  id: backendMed.medication_id,
  name: backendMed.name,
  category: backendMed.type,
  price: backendMed.price,
  stock: backendMed.stock_qty,
  lowStockThreshold: backendMed.threshold_qty,
  isLowStock: backendMed.stock_qty <= backendMed.threshold_qty,
  description: backendMed.description ?? '',
  dosage: backendMed.dosage ?? 0,
});
