import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/api/client';
import {
  updateOrderStatusApi,
  type OrderStatus,
} from '@/hooks/ordering/updateOrder';

export interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  order_number: string;
  patient_name: string;
  created_at: string;
  amount: number;
  status: OrderStatus; // Use the specific type here
  delivery_type: string;
  delivery_address: string;
  items: OrderItem[];
  subtotal: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    api
      .get(`/enavigator/orders`, { headers }) // Add /enavigator prefix
      .then((res) => {
        setOrders(res.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setOrders([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      fetchOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    const result = await updateOrderStatusApi(orderId, newStatus);

    if (result.success) {
      // 1. Update the local list
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
    } else {
      const errorMessage =
        result.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  return { orders, loading, error, refresh: fetchOrders, handleUpdateStatus };
}
