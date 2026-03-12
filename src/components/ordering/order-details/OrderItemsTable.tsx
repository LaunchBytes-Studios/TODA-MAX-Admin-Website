import { Package } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import type { Order } from '@/hooks/ordering/useOrders';

interface OrderItemsTableProps {
  order: Order;
}

export function OrderItemsTable({ order }: OrderItemsTableProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Package className="w-4 h-4" /> Order Items
      </h3>
      <div className="border rounded-xl overflow-y-auto max-h-80 scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b sticky top-0 z-10">
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
                  <p className="text-xs text-slate-500">{item.description}</p>
                </td>
                <td className="p-4 text-center font-medium">{item.quantity}</td>
                <td className="p-4 text-right font-bold text-slate-900">
                  ₱{formatMoney(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50 font-bold sticky bottom-0 z-20 border-t-2 border-slate-200">
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
  );
}
