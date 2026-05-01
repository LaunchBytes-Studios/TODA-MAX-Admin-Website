import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types/order';
import { MapPin, Edit2 } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DeliveryInfoProps {
  order: Order;
  isCompleted: boolean;
  onUpdateType?: (id: string, type: string) => Promise<void>;
}

export function DeliveryInfo({
  order,
  isCompleted,
  onUpdateType,
}: DeliveryInfoProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateType = async (type: string) => {
    if (!onUpdateType || isUpdating || order.delivery_type === type) return;
    setIsUpdating(true);
    await onUpdateType(order.order_id, type);
    setIsUpdating(false);
  };

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
      <div className="flex flex-wrap gap-2 items-center">
        {onUpdateType && !isCompleted ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isUpdating}
              className="focus:outline-none"
            >
              <Badge
                variant={
                  order.delivery_type === 'delivery' ? 'outline' : 'secondary'
                }
                className={`px-3 py-1 capitalize cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity ${
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
                <Edit2 className="w-3 h-3 ml-1" />
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleUpdateType('delivery')}>
                Delivery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateType('pickup')}>
                Pickup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Badge
            variant={
              order.delivery_type === 'delivery' ? 'outline' : 'secondary'
            }
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
        )}
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
