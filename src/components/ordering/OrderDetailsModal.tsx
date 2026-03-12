import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Order } from '@/hooks/ordering/useOrders';
import type { OrderStatus } from '@/hooks/ordering/updateOrder';
import {
  OrderHeader,
  PatientDetails,
  DeliveryInfo,
  OrderItemsTable,
  OrderActions,
} from './order-details';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
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
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
        <OrderHeader order={order} />

        <div className="p-6 space-y-6 bg-white">
          {/* Patient & Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientDetails order={order} />
            <DeliveryInfo order={order} isCompleted={isCompleted} />
          </div>

          {/* Items Table */}
          <OrderItemsTable order={order} />

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
                    Order is ready for{' '}
                    {order.delivery_type === 'delivery' ? 'delivery' : 'pickup'}
                    .
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
                      className="w-full h-12 italic text-green-600"
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
