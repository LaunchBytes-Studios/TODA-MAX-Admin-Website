import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { updateOrderStatusApi } from '@/hooks/ordering/updateOrder';
import type { Order, OrderStatus } from '@/types/order';

export function useOrders(
  activeTab: string,
  deliveryFilter: string,
  searchTerm: string,
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          status: activeTab !== 'all' ? activeTab : undefined,
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
