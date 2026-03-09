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
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{rewardName}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
              {category}
            </span>
            {isLowStock && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-orange-600">
                Low Stock
              </span>
            )}
          </div>
          <p className="text-gray-600">
            {description || 'No description provided.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <p>
              <span className="font-medium">Points cost:</span> {pointsCost} pts
            </p>
            <p>
              <span className="font-medium">Total Redeemed:</span>{' '}
              {totalRedeemed}
            </p>
            <p>
              <span className="font-medium">ID:</span> {code}
            </p>
          </div>

          <p
            className={`text-sm ${isLowStock ? 'text-orange-600' : 'text-gray-700'}`}
          >
            <span className="font-medium">Current stock:</span> {stockAvailable}{' '}
            available
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <CheckCircle2
              className="w-5 h-5 text-green-600"
              aria-label="Active reward"
            />
          ) : (
            <XCircle
              className="w-5 h-5 text-gray-400"
              aria-label="Inactive reward"
            />
          )}
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
