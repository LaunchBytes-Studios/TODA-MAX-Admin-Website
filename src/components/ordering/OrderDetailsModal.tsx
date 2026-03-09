import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOrderDisplayStatus } from '@/utils/order.utils';
import { formatMoney } from '@/lib/utils';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
} from 'lucide-react';
import type { Order } from '@/hooks/ordering/useOrders';
import type { OrderStatus } from '@/hooks/ordering/updateOrder';

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

  if (!order) return null;

  const displayStatus = getOrderDisplayStatus(order.created_at);

  const handleAction = async (newStatus: OrderStatus) => {
    try {
      setIsProcessing(true); // Start loading
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

  // Workflow logic
  const currentStatus = order.status.toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
        {/* Header with Background */}
        <div className="bg-blue-700 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Order #{order.order_number}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-blue-100">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(order.created_at).toLocaleString('en-PH', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Patient & Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                Patient Details
              </p>
              <p className="text-lg font-bold text-slate-900">
                {order.patient_name}
              </p>
              <div className="mt-3 space-y-2 flex items-start gap-2">
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
                  {order.delivery_type === 'delivery'
                    ? 'For Delivery'
                    : 'For Pickup'}
                </Badge>
                <Badge
                  className={`block w-fit text-xs py-1 px-2 capitalize ${
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
                              : order.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.status === 'new'
                    ? displayStatus
                    : order.status.replaceAll('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2">
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
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Order Items
            </h3>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-slate-500">
                    <th className="text-left p-4 font-semibold">Medicine</th>
                    <th className="text-center p-4 font-semibold">Qty</th>
                    <th className="text-right p-4 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.description}
                        </p>
                      </td>
                      <td className="p-4 text-center font-medium">
                        {item.quantity}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900">
                        ₱{formatMoney(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50 font-bold">
                  <tr>
                    <td colSpan={2} className="p-4 text-right text-slate-600">
                      Total Amount
                    </td>
                    <td className="p-4 text-right text-green-700 text-lg">
                      ₱{formatMoney(order.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
                    onClick={() => handleAction('out_for_delivery')}
                  >
                    <Truck className="w-4 h-4 mr-2" /> Mark as Out for Delivery
                  </Button>
                )}

                {/* 3. Delivery Workflow */}
                {currentStatus === 'out_for_delivery' && (
                  <Button
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleAction('completed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Complete Delivery
                  </Button>
                )}

                {/* 4. Completed/Rejected State */}
                {(currentStatus === 'completed' ||
                  currentStatus === 'rejected') && (
                  <Button
                    variant="ghost"
                    disabled
                    className="w-full h-12 italic text-slate-400"
                  >
                    Order has been processed
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
