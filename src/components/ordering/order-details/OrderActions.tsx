import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Loader2, Truck } from 'lucide-react';
import type { Order } from '@/hooks/ordering/useOrders';
import type { OrderStatus } from '@/hooks/ordering/updateOrder';

interface OrderActionsProps {
  order: Order;
  isProcessing: boolean;
  isCompleted: boolean;
  onAction: (status: OrderStatus) => Promise<void>;
}

export function OrderActions({
  order,
  isProcessing,
  isCompleted,
  onAction,
}: OrderActionsProps) {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

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

  const currentStatus = (order.status || '').toLowerCase();

  return (
    <div className="flex flex-col gap-3 pt-4 border-t">
      {isProcessing ? (
        <Button disabled className="w-full h-12 bg-slate-100 text-slate-400">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating Order...
        </Button>
      ) : (
        <>
          {/* 1. New Order Workflow */}
          {currentStatus === 'pending' && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowRejectConfirm(true)}
              >
                <XCircle className="w-4 h-4 mr-2" /> Reject Order
              </Button>
              <Button
                className="flex-2 h-12 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onAction('preparing')}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Accept & Prepare
              </Button>
            </div>
          )}

          {/* 2. Preparing Workflow */}
          {currentStatus === 'preparing' && (
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onAction('ready')}
            >
              <Truck className="w-4 h-4 mr-2" />
              Mark as Ready
            </Button>
          )}

          {/* 3. Ready Workflow */}
          {currentStatus === 'ready' && !isCompleted && (
            <div className="text-sm text-slate-500 text-center italic">
              Order is ready for{' '}
              {order.delivery_type === 'delivery' ? 'delivery' : 'pickup'}.
            </div>
          )}

          {/* 4. Completed/Rejected State */}
          {(currentStatus === 'completed' || currentStatus === 'rejected') &&
            order.received_date && (
              <Button
                variant="ghost"
                disabled
                className="w-full h-12 italic text-green-600"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Received: {formatOrderDate(order.received_date)}</span>
              </Button>
            )}
        </>
      )}

      <AlertDialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onAction('rejected')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Order
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
