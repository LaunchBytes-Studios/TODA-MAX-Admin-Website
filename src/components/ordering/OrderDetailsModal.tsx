import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  OrderHeader,
  PatientDetails,
  DeliveryInfo,
  OrderItemsTable,
  OrderActions,
} from './order-details';
import type { Order, OrderStatus } from '@/types/order';

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
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle className="sr-only">Error</DialogTitle>
          <div className="p-4 text-red-600">
            Error: Order status is missing. Please try again.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('OrderDetailsModal - Order data:', order);

  const handleAction = async (newStatus: OrderStatus) => {
    try {
      setIsProcessing(true);
      if (!order?.order_id) {
        alert('Error: Order ID is missing');
        return;
      }
      console.log(
        'Starting update for order:',
        order.order_id,
        'to',
        newStatus,
      );

      await onUpdateStatus(order.order_id, newStatus);

      console.log('Update successful');
      onClose();
    } catch (error) {
      alert(
        typeof error === 'string'
          ? error
          : 'Could not update order. Please check console.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isCompleted = order.received_date != null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Order Details</DialogTitle>
        <OrderHeader order={order} />

        <div className="p-6 space-y-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientDetails order={order} />
            <DeliveryInfo order={order} isCompleted={isCompleted} />
          </div>

          <OrderItemsTable order={order} />

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
