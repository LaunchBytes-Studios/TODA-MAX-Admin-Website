import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types/order';
import { MapPin } from 'lucide-react';

interface DeliveryInfoProps {
  order: Order;
  isCompleted: boolean;
}

export function DeliveryInfo({ order, isCompleted }: DeliveryInfoProps) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="flex items-start gap-2 mb-4">
        <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">
            Delivery Address
          </p>
          <p className="text-sm text-slate-900 leading-snug">
            {order.delivery_address}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={order.delivery_type === 'delivery' ? 'outline' : 'secondary'}
          className={`px-3 py-1 capitalize ${
            order.delivery_type === 'delivery'
              ? 'bg-green-100 text-green-800'
              : order.delivery_type === 'pickup'
                ? 'bg-purple-100 text-purple-800'
                : ''
          }`}
        >
          {order.delivery_type === 'delivery' ? 'For Delivery' : 'For Pickup'}
        </Badge>
        <Badge
          className={`block w-fit text-xs py-1 px-2 capitalize ${
            isCompleted || order.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                : order.status === 'preparing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'ready'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
          }`}
        >
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>
    </div>
  );
}
