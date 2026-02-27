import { OrderCard } from './OrderCard';

interface Order {
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

interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface OrdersListProps {
  orders: Order[];
  activeTab: string;
  searchTerm: string;
  onViewDetails: (order: Order) => void;
}

export function OrdersList({
  orders,
  activeTab,
  searchTerm,
  onViewDetails,
}: OrdersListProps) {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
          <p className="text-lg">No orders found</p>
          <p className="text-sm mt-1">
            {searchTerm
              ? 'Try different search terms'
              : `No ${activeTab} orders at the moment`}
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={onViewDetails}
          />
        ))
      )}
    </div>
  );
}
