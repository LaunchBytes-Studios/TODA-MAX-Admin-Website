import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { supabase } from '@/lib/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';
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
  patient_diagnosis: string;
  created_at: string;
  received_date?: string | null; // Timestamp when order was received/completed
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
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  const fetchOrders = useCallback(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    api
      .get(`/enavigator/orders`, { headers })
      .then((res) => {
        // Ensure all required fields have fallback values
        const formattedOrders = (res.data.data || []).map((order: Order) => ({
          ...order,
          patient_diagnosis: order.patient_diagnosis || 'No diagnosis provided',
          status: order.status || 'pending',
          delivery_type: order.delivery_type || 'delivery',
          delivery_address: order.delivery_address || 'No address provided',
        }));
        setOrders(formattedOrders);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch orders';
        console.error('Fetch orders error:', err);
        setError(errorMsg);
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

  // real-time subscription
  useEffect(() => {
    try {
      console.log('🔄 Setting up real-time subscription for Order table...');

      // INSERT events on the Order table
      const channel = supabase
        .channel('public:Order')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'Order' },
          (payload: { new: Order }) => {
            console.log('📢 New order received:', payload.new);
            if (!payload.new) {
              console.warn('⚠️ Payload has no new data');
              return;
            }

            const newOrder = payload.new;
            const orderId = newOrder.order_id || newOrder.id;

            // Refresh orders to get the latest data
            fetchOrders();

            // Calculate pending order count (including the new one)
            const pendingCount =
              orders.filter((o) => o.status === 'pending').length + 1;

            toast.success(`New Order Received!`, {
              description: `Order #${orderId?.substring(0, 8).toUpperCase() || 'N/A'} • ${pendingCount} pending order${pendingCount !== 1 ? 's' : ''}`,
              duration: 5000,
            });
          },
        )
        .subscribe((status) => {
          console.log('📡 Subscription status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.error(
              '❌ Channel error - real-time may not be enabled for Order table',
            );
          }
          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to Order table changes');
          }
        });
      subscriptionRef.current = channel;
      console.log('✅ Real-time subscription established');
    } catch (err) {
      console.error('❌ Error setting up real-time subscription:', err);
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        console.log('🛑 Cleaning up real-time subscription');
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [fetchOrders, orders]);

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
