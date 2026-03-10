export interface LowStockItem {
  medicine: string;
  category: string;
  current: number;
  minStock: number;
  status: 'Low';
}
