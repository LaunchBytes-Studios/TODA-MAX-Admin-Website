import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardCardProps {
  id: number;
  rewardName: string;
  description: string;
  category: string;
  pointsCost: number;
  totalRedeemed: number;
  code: string;
  stockAvailable: number;
  isLowStock: boolean;
  isActive: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function RewardCard({
  id,
  rewardName,
  description,
  category,
  pointsCost,
  totalRedeemed,
  code,
  stockAvailable,
  isLowStock,
  isActive,
  onEdit,
  onDelete,
}: RewardCardProps) {
  const isOutOfStock = stockAvailable === 0;
  const quantityLabel = isOutOfStock
    ? 'Out of Stock'
    : isLowStock
      ? 'Low Stock'
      : 'In Stock';
  const quantityBadgeClass = isOutOfStock
    ? 'bg-red-100 text-red-600'
    : isLowStock
      ? 'bg-yellow-100 text-orange-600'
      : 'bg-green-100 text-green-700';
  const StatusIcon = isActive ? CheckCircle2 : XCircle;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-white p-6 pl-8">
      <div
        className={`absolute inset-y-0 left-0 w-1.5 ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        }`}
      />

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
          <span className="text-gray-500">Status:</span>
          <StatusIcon
            className={`h-4 w-4 ${isActive ? 'text-green-600' : 'text-red-600'}`}
          />
          <span className={isActive ? 'text-green-700' : 'text-red-700'}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </span>
        <span className="hidden h-4 w-px bg-gray-200 sm:inline-block" />
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
          {category}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${quantityBadgeClass}`}
        >
          {quantityLabel}
        </span>
      </div>

      <div className="my-2 h-px bg-gray-200" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{rewardName}</h3>
          <p className="text-gray-600">
            {description || 'No description provided.'}
          </p>
        </div>

        <div className="grid gap-3 border-t pt-4 text-sm text-gray-700 sm:grid-cols-2 lg:min-w-72 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Points Cost
            </p>
            <p className="mt-1 font-medium text-gray-900">{pointsCost} pts</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total Redeems
            </p>
            <p className="mt-1 font-medium text-gray-900">{totalRedeemed}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Current Stock
            </p>
            <p
              className={`mt-1 font-medium ${
                isOutOfStock
                  ? 'text-red-600'
                  : isLowStock
                    ? 'text-orange-600'
                    : 'text-gray-700'
              }`}
            >
              {stockAvailable} available
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              ID
            </p>
            <p className="mt-1 font-medium text-gray-900">{code}</p>
          </div>
        </div>

        <div className="flex gap-2 border-t pt-4 lg:flex-col lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(id)}
            className="hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(id)}
            className="hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RewardCard;
