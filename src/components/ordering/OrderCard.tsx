import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils';
import type { Order } from '@/hooks/ordering/useOrders';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  // Safe date formatting
  const formatOrderDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date unavailable';
      return new Date(dateString).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Manila',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date unavailable';
    }
  };

  return (
    <Card className="p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-medium text-sm text-muted-foreground">
            Order No. {order.order_number || 'N/A'}
          </p>
          <p className="text-lg font-semibold">
            {order.patient_name || 'Unknown'}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatOrderDate(order.created_at)}
          </p>
          {order.received_date && order.status === 'completed' && (
            <p className="text-sm text-green-600 font-medium">
              Received: {formatOrderDate(order.received_date)}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <p className="text-xl font-bold text-green-700">
            ₱{order.amount.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-2 justify-end">
            <Badge
              variant={order.status === 'preparing' ? 'secondary' : 'outline'}
              className={`capitalize px-3 py-1 ${
                order.status === 'pending'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : order.status === 'preparing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'ready'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : ''
              }`}
            >
              {order.status.replace(/_/g, ' ')}
            </Badge>
            <Badge
              variant={
                order.delivery_type === 'delivery' ? 'outline' : 'secondary'
              }
              className={`px-3 py-1 ${
                order.delivery_type === 'delivery'
                  ? 'bg-green-100 text-green-800'
                  : order.delivery_type === 'pickup'
                    ? 'bg-yellow-100 text-yellow-800'
                    : ''
              }`}
            >
              {order.delivery_type === 'delivery'
                ? 'For Delivery'
                : 'For Pickup'}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(order)}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
