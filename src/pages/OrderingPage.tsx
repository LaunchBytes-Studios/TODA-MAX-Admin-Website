import { useEffect, useState } from 'react';
import { OrderingPageSkeleton } from '@/components/skeleton/OrderingPageSkeleton';
import { StatsCards } from '@/components/ordering/StatsCards';
import { SearchAndFilterBar } from '@/components/ordering/SearchAndFilterBar';
import { OrdersList } from '@/components/ordering/OrderList';
import { OrderDetailsModal } from '@/components/ordering/OrderDetailsModal';
import { useOrders } from '@/hooks/ordering/useOrders';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Order } from '@/types/order';

export default function OrderingPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    orders,
    loading,
    error,
    handleUpdateStatus,
    page,
    setPage,
    total,
    limit,
    stats,
  } = useOrders(activeTab, deliveryFilter, searchTerm);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setPage(1);
  }, [activeTab, deliveryFilter, searchTerm, setPage]);
  const { newOrders, updateNewOrders, resetOrders } = useNotifications();

  useEffect(() => {
    resetOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stats && newOrders !== stats.pending) {
      updateNewOrders(stats.pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  if (loading) return <OrderingPageSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <StatsCards
        total={stats.total}
        newOrders={stats.pending}
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
        orders={orders}
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
            Page {page} of {totalPages} ({total} total orders)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded border border-gray-300 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), page + 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded ${
                    page === p
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded border border-gray-300 disabled:opacity-50"
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
