import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderingPageSkeleton } from '@/components/skeleton/OrderingPageSkeleton';
import { ShoppingCart, Box, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface Order {
  id: string;
  order_number: string;
  patient_name: string;
  created_at: string;
  amount: string | number;
  status: string;
  delivery_type: string;
}

export default function OrderingPage() {
  const { orders, loading, error, handleUpdateStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('pending'); // Default to 'pending' instead of 'new'
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('delivery'); // Filter by delivery type
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Dynamic stats based on live data
  const stats = {
    total: orders.length,
    newOrders: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  // Client-side filtering
  // OrderingPage.tsx

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

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleDeliveryFilterChange = (filter: string) => {
    setDeliveryFilter(filter);
    setCurrentPage(1);
  };

  if (loading) return <OrderingPageSkeleton />;

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
        onSearchChange={handleSearchChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        deliveryFilter={deliveryFilter}
        onDeliveryFilterChange={handleDeliveryFilterChange}
      />

      <OrdersList
        orders={paginatedOrders}
        activeTab={activeTab}
        searchTerm={searchTerm}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setIsModalOpen(true);
        }}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          itemsPerPage: ITEMS_PER_PAGE,
          totalItems: filteredOrders.length,
        }}
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus} // Wiring up the logic
      />
    </div>
  );
}
