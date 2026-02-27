import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: {
    id: string;
    order_number: string;
    patient_name: string;
    created_at: string;
    amount: number;
    status: string;
    delivery_type: string;
  };
  onViewDetails: (order: OrderCardProps['order']) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
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
            ₱{order.amount.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-2 justify-end">
            <Badge
              variant={
                order.status === 'new'
                  ? 'outline'
                  : order.status === 'preparing'
                    ? 'secondary'
                    : order.status === 'out_for_delivery'
                      ? 'outline'
                      : 'outline'
              }
              className={`capitalize px-3 py-1 ${
                order.status === 'new'
                  ? 'bg-red-100 text-red-800'
                  : order.status === 'out_for_delivery'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : ''
              }`}
            >
              {order.status.replaceAll('_', ' ')}
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
