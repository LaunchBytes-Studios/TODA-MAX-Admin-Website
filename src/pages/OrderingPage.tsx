import { useState } from 'react';
import { OrderingPageSkeleton } from '@/components/skeleton/OrderingPageSkeleton';
import { StatsCards } from '@/components/ordering/StatsCards';
import { SearchAndFilterBar } from '@/components/ordering/SearchAndFilterBar';
import { OrdersList } from '@/components/ordering/OrderList';
import { OrderDetailsModal } from '@/components/ordering/OrderDetailsModal';
import { useOrders } from '@/hooks/ordering/useOrders';
import type { Order } from '@/hooks/ordering/useOrders';

export default function OrderingPage() {
  const { orders, loading, error, handleUpdateStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('delivery');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic stats based on live data
  const stats = {
    total: orders.length,
    newOrders: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  const filteredOrders = orders
    .filter((order) => {
      const statusMap: Record<string, string[]> = {
        pending: ['pending'],
        preparing: ['preparing'],
        ready: ['ready'],
        completed: ['completed'],
        rejected: ['rejected'],
      };

      const allowedStatuses = statusMap[activeTab] || [];

      const matchesStatus = allowedStatuses.includes(
        order.status?.toLowerCase().trim() ?? '',
      );

      const matchesDeliveryType = order.delivery_type === deliveryFilter;

      const matchesSearch =
        searchTerm === '' ||
        order.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesDeliveryType && matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  if (loading) return <OrderingPageSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <StatsCards
        total={stats.total}
        newOrders={stats.newOrders}
        preparing={stats.preparing}
        ready={stats.ready}
      />

      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        deliveryFilter={deliveryFilter}
        onDeliveryFilterChange={setDeliveryFilter}
      />

      <OrdersList
        orders={filteredOrders}
        activeTab={activeTab}
        searchTerm={searchTerm}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setIsModalOpen(true);
        }}
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
