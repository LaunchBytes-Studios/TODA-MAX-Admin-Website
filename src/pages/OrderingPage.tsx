import React, { useState } from 'react';
import { OrderingPageSkeleton } from '@/components/skeleton/OrderingPageSkeleton';
import { StatsCards } from '@/components/ordering/StatsCards';
import { SearchAndFilterBar } from '@/components/ordering/SearchAndFilterBar';
import { OrdersList } from '@/components/ordering/OrderList';
import { OrderDetailsModal } from '@/components/ordering/OrderDetailsModal';
import { useOrders } from '@/hooks/ordering/useOrders';
import type { Order } from '@/hooks/ordering/useOrders';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function OrderingPage() {
  const { orders, loading, error, handleUpdateStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('delivery');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dynamic stats based on live data
  const stats = {
    total: orders.filter((o) => o.status !== 'rejected').length,
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

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, deliveryFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  if (loading) return <OrderingPageSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <StatsCards
        total={stats.completed}
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
        orders={paginatedOrders}
        activeTab={activeTab}
        searchTerm={searchTerm}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setIsModalOpen(true);
        }}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{' '}
            {Math.min(endIndex, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
