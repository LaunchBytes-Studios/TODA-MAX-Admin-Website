import { OrderCard } from './OrderCard';
import type { Order } from '@/hooks/ordering/useOrders';

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
