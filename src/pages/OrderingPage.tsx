import { useState } from 'react';
import { OrderingPageSkeleton } from '@/components/skeleton/OrderingPageSkeleton';
import { StatsCards } from '@/components/ordering/StatsCards';
import { SearchAndFilterBar } from '@/components/ordering/SearchAndFilterBar';
import { OrdersList } from '@/components/ordering/OrderList';
import { OrderDetailsModal } from '@/components/ordering/OrderDetailsModal';

// ────────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────────

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
  status: string;
  delivery_type: string;
  delivery_address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
}

const mockOrders: Order[] = [
  {
    id: 'ord-001',
    order_number: '2024-0034',
    patient_name: 'Juan Dela Cruz',
    created_at: '2024-12-12T13:30:00+08:00',
    amount: 625.0,
    status: 'new',
    delivery_type: 'delivery',
    delivery_address: 'Purok 3, Barangay Tuburan, Pototan, Iloilo',
    items: [
      {
        name: 'Losartan 50mg',
        description: '(30 tablets)',
        quantity: 2,
        price: 360.0,
      },
      {
        name: 'Metformin 500mg',
        description: '(60 tablets)',
        quantity: 1,
        price: 120.0,
      },
      {
        name: 'Glimepiride 2mg',
        description: '(30 tablets)',
        quantity: 1,
        price: 95.0,
      },
    ],
    subtotal: 575.0,
    delivery_fee: 50.0,
  },
  {
    id: 'ord-002',
    order_number: '2024-0035',
    patient_name: 'Maria Santos',
    created_at: '2024-12-12T14:15:00+08:00',
    amount: 895.0,
    status: 'new',
    delivery_type: 'pickup',
    delivery_address: 'Main Branch, Iloilo City',
    items: [
      {
        name: 'Lisinopril 10mg',
        description: '(30 tablets)',
        quantity: 1,
        price: 280.0,
      },
      {
        name: 'Atorvastatin 20mg',
        description: '(30 tablets)',
        quantity: 2,
        price: 400.0,
      },
      {
        name: 'Amlodipine 5mg',
        description: '(30 tablets)',
        quantity: 1,
        price: 215.0,
      },
    ],
    subtotal: 895.0,
    delivery_fee: 0.0,
  },
  {
    id: 'ord-003',
    order_number: '2024-0036',
    patient_name: 'Jose Rizal',
    created_at: '2024-12-11T10:00:00+08:00',
    amount: 370.75,
    status: 'preparing',
    delivery_type: 'delivery',
    delivery_address: 'Barangay Mandurriao, Iloilo City',
    items: [
      {
        name: 'Clopidogrel 75mg',
        description: '(28 tablets)',
        quantity: 1,
        price: 280.75,
      },
      {
        name: 'Omeprazole 20mg',
        description: '(14 capsules)',
        quantity: 1,
        price: 90.0,
      },
    ],
    subtotal: 320.75,
    delivery_fee: 50.0,
  },
  {
    id: 'ord-004',
    order_number: '2024-0037',
    patient_name: 'Andres Bonifacio',
    created_at: '2024-12-10T09:30:00+08:00',
    amount: 450.0,
    status: 'preparing',
    delivery_type: 'pickup',
    delivery_address: 'Main Branch, Iloilo City',
    items: [
      {
        name: 'Warfarin 5mg',
        description: '(100 tablets)',
        quantity: 1,
        price: 450.0,
      },
    ],
    subtotal: 450.0,
    delivery_fee: 0.0,
  },
  {
    id: 'ord-005',
    order_number: '2024-0038',
    patient_name: 'Emilio Aguinaldo',
    created_at: '2024-12-09T16:20:00+08:00',
    amount: 1250.0,
    status: 'out_for_delivery',
    delivery_type: 'delivery',
    delivery_address: 'Barangay Lapaz, Iloilo City',
    items: [
      {
        name: 'Insulin Glargine',
        description: '(10 mL vial)',
        quantity: 2,
        price: 600.0,
      },
      {
        name: 'Sitagliptin 100mg',
        description: '(30 tablets)',
        quantity: 1,
        price: 500.0,
      },
      {
        name: 'Dapagliflozin 10mg',
        description: '(30 tablets)',
        quantity: 1,
        price: 100.0,
      },
    ],
    subtotal: 1200.0,
    delivery_fee: 50.0,
  },
  {
    id: 'ord-006',
    order_number: '2024-0039',
    patient_name: 'Gabriela Silang',
    created_at: '2024-12-08T11:45:00+08:00',
    amount: 725.25,
    status: 'out_for_delivery',
    delivery_type: 'delivery',
    delivery_address: 'Barangay Singcang-Puerto, Iloilo City',
    items: [
      {
        name: 'Levothyroxine 50mcg',
        description: '(100 tablets)',
        quantity: 1,
        price: 150.0,
      },
      {
        name: 'Propranolol 40mg',
        description: '(30 tablets)',
        quantity: 2,
        price: 425.25,
      },
      {
        name: 'Diltiazem 120mg',
        description: '(30 capsules)',
        quantity: 1,
        price: 100.0,
      },
    ],
    subtotal: 675.25,
    delivery_fee: 50.0,
  },
  {
    id: 'ord-007',
    order_number: '2024-0040',
    patient_name: 'Apolinario Mabini',
    created_at: '2024-12-07T08:10:00+08:00',
    amount: 980.0,
    status: 'completed',
    delivery_type: 'pickup',
    delivery_address: 'Main Branch, Iloilo City',
    items: [
      {
        name: 'Sertraline 50mg',
        description: '(30 tablets)',
        quantity: 1,
        price: 320.0,
      },
      {
        name: 'Alprazolam 0.5mg',
        description: '(30 tablets)',
        quantity: 2,
        price: 400.0,
      },
      {
        name: 'Buspirone 15mg',
        description: '(60 tablets)',
        quantity: 1,
        price: 260.0,
      },
    ],
    subtotal: 980.0,
    delivery_fee: 0.0,
  },
];

const mockStats = {
  total: 7,
  newOrders: 2,
  preparing: 2,
  outForDelivery: 2,
  past: 1,
};

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────

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
