import { Calendar } from 'lucide-react';
import type { Order } from '@/hooks/ordering/useOrders';

interface OrderHeaderProps {
  order: Order;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  const formatOrderDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date unavailable';
      return new Date(dateString).toLocaleString('en-PH', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date unavailable';
    }
  };

  return (
    <div className="bg-blue-700 p-6 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Order #{order.order_number || 'N/A'}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-blue-100">
            <Calendar className="w-4 h-4" />
            <span>{formatOrderDate(order.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
