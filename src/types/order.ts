export interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  order_number: string;
  patient_name: string;
  patient_diagnosis: string;
  order_date: string;
  received_date?: string | null;
  amount: number;
  status: OrderStatus;
  delivery_type: string | null;
  delivery_address: string;
  items: OrderItem[];
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'rejected';
