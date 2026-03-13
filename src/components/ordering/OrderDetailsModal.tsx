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
          <OrderActions
            order={order}
            isCompleted={isCompleted}
            onAction={handleAction}
            isProcessing={isProcessing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
