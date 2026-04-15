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
  order_date: string;
  received_date?: string | null;
  amount: number;
  status: OrderStatus;
  delivery_type: string | null;
  delivery_address: string;
  items: OrderItem[];
}

export function useOrders(
  activeTab: string,
  deliveryFilter: string,
  searchTerm: string,
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, deliveryFilter, searchTerm]);

  const fetchOrders = useCallback(() => {
    setLoading(true);

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const offset = (page - 1) * limit;

    api
      .get(`/enavigator/orders`, {
        headers,
        params: {
          limit,
          offset,
          status: activeTab,
          delivery_type: deliveryFilter !== 'all' ? deliveryFilter : undefined,
          search: searchTerm || undefined,
        },
      })
      .then((res) => {
        const formattedOrders = (res.data.data || []).map((order: Order) => ({
          ...order,
          patient_diagnosis: order.patient_diagnosis || 'No diagnosis provided',
          status: order.status || 'pending',
          delivery_type: order.delivery_type ?? null,
          delivery_address: order.delivery_address || 'No address provided',
        }));

        setOrders(formattedOrders);
        setTotal(res.data.pagination?.total || 0);
        setStats(
          res.data.stats ?? {
            total: 0,
            pending: 0,
            preparing: 0,
            ready: 0,
            completed: 0,
          },
        );
        setError(null);
      })
      .catch((err) => {
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch orders';

        setError(errorMsg);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, activeTab, deliveryFilter, searchTerm]);

  useEffect(() => {
    fetchOrders();
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
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();
    } else {
      toast.error(result.data?.message || 'Update failed');
    }
  };

  return {
    orders,
    loading,
    error,
    page,
    setPage,
    total,
    limit,
    stats,
    refresh: fetchOrders,
    handleUpdateStatus,
  };
}
