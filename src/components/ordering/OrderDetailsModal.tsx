import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Order } from '@/pages/OrderingPage';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const orderDate = new Date(order.created_at);
  const dateString = orderDate.toLocaleDateString('en-PH', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  });
  const timeString = orderDate.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden [&_button[type='button']:last-child]:hidden">
        {/* Blue Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-blue-100">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-200 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Customer and Date Info */}
          <div className="grid grid-cols-3 gap-4 border-b pb-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Customer</p>
              <p className="text-base font-semibold text-gray-900">
                {order.patient_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
              <p className="text-base font-semibold text-gray-900">
                {dateString}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Time</p>
              <p className="text-base font-semibold text-gray-900">
                {timeString}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-b pb-3">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Delivery Address
            </p>
            <p className="text-gray-900">{order.delivery_address}</p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Order Items
            </h3>
            <div className="space-y-2 border-b pb-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.name}{' '}
                      <span className="text-xs text-gray-600 font-normal">
                        {item.description}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 min-w-fit ml-4">
                    ₱{item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal and Fees */}
          <div className="space-y-2 border-b pb-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-semibold text-gray-900">
                ₱{order.subtotal.toFixed(2)}
              </p>
            </div>
            {order.delivery_fee > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Delivery Fee</p>
                <p className="font-semibold text-gray-900">
                  ₱{order.delivery_fee.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-2">
            <p className="text-base font-semibold text-gray-900">Total</p>
            <p className="text-xl font-bold text-green-600">
              ₱{order.amount.toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 bg-red-500 text-white border-0 hover:bg-red-600 hover:text-red-200 text-sm"
            >
              Decline Order
            </Button>
            <Button className="flex-1 bg-green-600 text-white hover:bg-green-700 hover:text-green-200 text-sm">
              Confirm Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
