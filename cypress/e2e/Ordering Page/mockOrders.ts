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
  delivery_type: 'delivery' | 'pickup';
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'rejected';
  delivery_address: string;
  amount: number;
  items: OrderItem[];
}

export const mockOrders: Order[] = [
  // PENDING (12 orders — enough to trigger pagination)
  {
    order_id: '1',
    order_number: 'ORD-001',
    patient_name: 'John Doe',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '123 Cypress St, Test City',
    amount: 50.0,
    items: [
      { name: 'Medicine A', description: 'desc', quantity: 2, price: 25.0 },
    ],
  },
  {
    order_id: '2',
    order_number: 'ORD-002',
    patient_name: 'Mark Santos',
    patient_diagnosis: 'Hypertension',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'pending',
    delivery_address: 'Pharmacy Counter 1',
    amount: 40.0,
    items: [
      { name: 'Medicine F', description: 'desc', quantity: 2, price: 20.0 },
    ],
  },
  {
    order_id: '3',
    order_number: 'ORD-003',
    patient_name: 'Maria Garcia',
    patient_diagnosis: 'Diabetes',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '456 Sample Blvd',
    amount: 60.0,
    items: [
      { name: 'Medicine G', description: 'desc', quantity: 3, price: 20.0 },
    ],
  },
  {
    order_id: '4',
    order_number: 'ORD-004',
    patient_name: 'Rico Navarro',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '789 Elm St',
    amount: 30.0,
    items: [
      { name: 'Medicine L', description: 'desc', quantity: 1, price: 30.0 },
    ],
  },
  {
    order_id: '5',
    order_number: 'ORD-005',
    patient_name: 'Liza Dela Cruz',
    patient_diagnosis: 'Cold',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'pending',
    delivery_address: 'Pharmacy Counter 2',
    amount: 20.0,
    items: [
      { name: 'Medicine M', description: 'desc', quantity: 1, price: 20.0 },
    ],
  },
  {
    order_id: '6',
    order_number: 'ORD-006',
    patient_name: 'Ramon Bautista',
    patient_diagnosis: 'Hypertension',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '321 Oak Ave',
    amount: 55.0,
    items: [
      { name: 'Medicine N', description: 'desc', quantity: 2, price: 27.5 },
    ],
  },
  {
    order_id: '7',
    order_number: 'ORD-007',
    patient_name: 'Cynthia Flores',
    patient_diagnosis: 'Diabetes',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'pending',
    delivery_address: 'Pharmacy Counter 3',
    amount: 45.0,
    items: [
      { name: 'Medicine O', description: 'desc', quantity: 3, price: 15.0 },
    ],
  },
  {
    order_id: '8',
    order_number: 'ORD-008',
    patient_name: 'Dante Ramos',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '654 Pine Rd',
    amount: 35.0,
    items: [
      { name: 'Medicine P', description: 'desc', quantity: 1, price: 35.0 },
    ],
  },
  {
    order_id: '9',
    order_number: 'ORD-009',
    patient_name: 'Elena Soriano',
    patient_diagnosis: 'Cold',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'pending',
    delivery_address: 'Pharmacy Counter 4',
    amount: 25.0,
    items: [
      { name: 'Medicine Q', description: 'desc', quantity: 1, price: 25.0 },
    ],
  },
  {
    order_id: '10',
    order_number: 'ORD-010',
    patient_name: 'Felix Aquino',
    patient_diagnosis: 'Hypertension',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '987 Maple Ln',
    amount: 70.0,
    items: [
      { name: 'Medicine R', description: 'desc', quantity: 2, price: 35.0 },
    ],
  },
  {
    order_id: '11',
    order_number: 'ORD-011',
    patient_name: 'Gloria Mendez',
    patient_diagnosis: 'Diabetes',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'pending',
    delivery_address: 'Pharmacy Counter 5',
    amount: 80.0,
    items: [
      { name: 'Medicine S', description: 'desc', quantity: 4, price: 20.0 },
    ],
  },
  {
    order_id: '12',
    order_number: 'ORD-012',
    patient_name: 'Hector Villanueva',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'pending',
    delivery_address: '111 Cedar Blvd',
    amount: 65.0,
    items: [
      { name: 'Medicine T', description: 'desc', quantity: 1, price: 65.0 },
    ],
  },

  // PREPARING (2 orders)
  {
    order_id: '13',
    order_number: 'ORD-013',
    patient_name: 'Jane Doe',
    patient_diagnosis: 'Cold',
    order_date: new Date(Date.now() - 86400000).toISOString(),
    delivery_type: 'pickup',
    status: 'preparing',
    delivery_address: 'Pharmacy Counter 1',
    amount: 25.5,
    items: [
      { name: 'Medicine B', description: 'desc', quantity: 1, price: 25.5 },
    ],
  },
  {
    order_id: '14',
    order_number: 'ORD-014',
    patient_name: 'Luis Reyes',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'preparing',
    delivery_address: '789 Test Rd',
    amount: 35.0,
    items: [
      { name: 'Medicine H', description: 'desc', quantity: 1, price: 35.0 },
    ],
  },

  // READY (2 orders)
  {
    order_id: '15',
    order_number: 'ORD-015',
    patient_name: 'Bob Smith',
    patient_diagnosis: 'Diabetes',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'ready',
    delivery_address: '456 Test Ave',
    amount: 100.0,
    items: [
      { name: 'Medicine C', description: 'desc', quantity: 1, price: 100.0 },
    ],
  },
  {
    order_id: '16',
    order_number: 'ORD-016',
    patient_name: 'Anna Lim',
    patient_diagnosis: 'Hypertension',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'ready',
    delivery_address: 'Pharmacy Counter 2',
    amount: 55.0,
    items: [
      { name: 'Medicine I', description: 'desc', quantity: 2, price: 27.5 },
    ],
  },

  // COMPLETED (2 orders)
  {
    order_id: '17',
    order_number: 'ORD-017',
    patient_name: 'Alice Cruz',
    patient_diagnosis: 'Hypertension',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'completed',
    delivery_address: 'Pharmacy Counter 2',
    amount: 75.0,
    items: [
      { name: 'Medicine D', description: 'desc', quantity: 3, price: 25.0 },
    ],
  },
  {
    order_id: '18',
    order_number: 'ORD-018',
    patient_name: 'Pedro Villanueva',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'completed',
    delivery_address: '321 Main St',
    amount: 45.0,
    items: [
      { name: 'Medicine J', description: 'desc', quantity: 1, price: 45.0 },
    ],
  },

  // REJECTED (2 orders)
  {
    order_id: '19',
    order_number: 'ORD-019',
    patient_name: 'Carlos Reyes',
    patient_diagnosis: 'Flu',
    order_date: new Date().toISOString(),
    delivery_type: 'delivery',
    status: 'rejected',
    delivery_address: '789 Sample Rd',
    amount: 30.0,
    items: [
      { name: 'Medicine E', description: 'desc', quantity: 1, price: 30.0 },
    ],
  },
  {
    order_id: '20',
    order_number: 'ORD-020',
    patient_name: 'Rosa Mendoza',
    patient_diagnosis: 'Cold',
    order_date: new Date().toISOString(),
    delivery_type: 'pickup',
    status: 'rejected',
    delivery_address: 'Pharmacy Counter 3',
    amount: 20.0,
    items: [
      { name: 'Medicine K', description: 'desc', quantity: 1, price: 20.0 },
    ],
  },
];

export const mockStats = {
  total: mockOrders.length,
  pending: mockOrders.filter((o) => o.status === 'pending').length,
  preparing: mockOrders.filter((o) => o.status === 'preparing').length,
  ready: mockOrders.filter((o) => o.status === 'ready').length,
  completed: mockOrders.filter((o) => o.status === 'completed').length,
  rejected: mockOrders.filter((o) => o.status === 'rejected').length,
};

/**
 * Simulates backend filtering + pagination
 */
export function getMockResponse(url: string) {
  const parsed = new URL(url);
  const status = parsed.searchParams.get('status') ?? '';
  const search = parsed.searchParams.get('search') ?? '';
  const limit = parseInt(parsed.searchParams.get('limit') ?? '10', 10);
  const offset = parseInt(parsed.searchParams.get('offset') ?? '0', 10);

  let filtered = [...mockOrders];

  if (status) {
    filtered = filtered.filter((o) => o.status === status);
  }

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter((o) =>
      o.patient_name.toLowerCase().includes(lower),
    );
  }

  const paginated = filtered.slice(offset, offset + limit);

  return {
    data: paginated,
    stats: mockStats,
    pagination: {
      total: filtered.length,
    },
  };
}
