import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOrderDisplayStatus } from '@/utils/order.utils';
import { formatMoney } from '@/lib/utils';
import type { Order } from '@/hooks/ordering/useOrders';

interface OrderCardProps {
  order: Order; // Use the main Order interface
  onViewDetails: (order: Order) => void; // Fixed return type to void
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const displayStatus = getOrderDisplayStatus(order.created_at);
  return (
    <Card className="p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-medium text-sm text-muted-foreground">
            Order No. {order.order_number}
          </p>
          <p className="text-lg font-semibold">{order.patient_name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString('en-PH', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Manila',
            })}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <p className="text-xl font-bold text-green-700">
            ₱{formatMoney(order.amount)}
          </p>
          <div className="flex flex-wrap gap-2 justify-end">
            <Badge
              variant={
                (order.status === 'new' ? displayStatus : order.status) ===
                'new'
                  ? 'outline'
                  : (order.status === 'new' ? displayStatus : order.status) ===
                      'preparing'
                    ? 'secondary'
                    : (order.status === 'new'
                          ? displayStatus
                          : order.status) === 'out_for_delivery'
                      ? 'outline'
                      : 'outline'
              }
              className={`capitalize px-3 py-1 ${
                order.status === 'new' && displayStatus === 'new'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : order.status === 'new' && displayStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : order.status === 'preparing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'out_for_delivery'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : ''
              }`}
            >
              {(order.status === 'new'
                ? displayStatus
                : order.status
              ).replaceAll('_', ' ')}
            </Badge>
            <Badge
              variant={
                order.delivery_type === 'delivery' ? 'outline' : 'secondary'
              }
              className={`px-3 py-1 ${
                order.delivery_type === 'delivery'
                  ? 'bg-green-100 text-green-800'
                  : order.delivery_type === 'pickup'
                    ? 'bg-purple-100 text-purple-800'
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
              className="bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer hover:text-blue-100 text-sm"
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
