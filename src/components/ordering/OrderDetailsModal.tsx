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
  onUpdateStatus,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) {
    return null;
  }

  if (!order.status) {
    console.error('Order status is missing:', order);
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="p-4 text-red-600">
            Error: Order status is missing. Please try again.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('OrderDetailsModal - Order data:', order); // Debug log

  const handleAction = async (newStatus: OrderStatus) => {
    try {
      setIsProcessing(true); // Start loading
      if (!order?.id) {
        console.error('Order ID is missing');
        alert('Error: Order ID is missing');
        return;
      }
      console.log('Starting update for order:', order.id, 'to', newStatus);

      await onUpdateStatus(order.id, newStatus);

      console.log('Update successful');
      onClose(); // Close modal only on success
    } catch (error) {
      console.error('Action failed:', error);
      alert('Could not update order. Please check console.');
    } finally {
      setIsProcessing(false); // ALWAYS stop loading, even on error
    }
  };

  // Check if order is completed by received_date
  const isCompleted = order.received_date != null;

  // Check if order is completed by received_date
  const isCompleted = order.received_date != null;

  // Workflow logic
  const currentStatus = (order.status || '').toLowerCase();

  // Safe date formatting
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

          {/* Dynamic Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            {isProcessing ? (
              <Button
                disabled
                className="w-full h-12 bg-slate-100 text-slate-400"
              >
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating
                Order...
              </Button>
            ) : (
              <>
                {/* 1. New Order Workflow */}
                {currentStatus === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleAction('rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reject Order
                    </Button>
                    <Button
                      className="flex-2 h-12 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleAction('preparing')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Accept & Prepare
                    </Button>
                  </div>
                )}

                {/* 2. Preparing Workflow */}
                {currentStatus === 'preparing' && (
                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAction('ready')}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Ready
                  </Button>
                )}

                {/* 3. Ready Workflow */}
                {currentStatus === 'ready' && !isCompleted && (
                  <div className="text-sm text-slate-500 text-center italic">
                    Order is ready for customer
                  </div>
                )}

                {currentStatus === 'ready_for_pickup' && (
                  <Button
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAction('completed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark as Completed
                  </Button>
                )}

                {/* 4. Completed/Rejected State */}
                {(currentStatus === 'completed' ||
                  currentStatus === 'rejected') &&
                  order.received_date && (
                    <Button
                      variant="ghost"
                      disabled
                      className="w-full h-12 italic text-green-400"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Received: {formatOrderDate(order.received_date)}
                      </span>
                    </Button>
                  )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
