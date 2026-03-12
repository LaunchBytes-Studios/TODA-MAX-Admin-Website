import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface MedicineCardProps {
  id: number;
  name: string;
  category: string;
  description?: string;
  dosage?: number;
  stock: number;
  isLowStock?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  id,
  name,
  category,
  description,
  dosage,
  stock,
  isLowStock = false,
  onEdit,
  onDelete,
}) => {
  const isOutOfStock = stock === 0;
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

  return (
    <div className="rounded-xl border bg-white px-6 py-5">
      <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">
            {description || 'No description provided.'}
          </p>
        </div>

        <div className="grid gap-2.5 border-t pt-3 text-sm text-gray-700 sm:grid-cols-2 lg:min-w-52 lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0 lg:grid-cols-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Dosage
            </p>
            <p className="mt-1 font-medium text-gray-900">
              {typeof dosage === 'number' ? `${dosage} mg` : 'N/A'}
            </p>
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
                    : 'text-gray-900'
              }`}
            >
              {stock}
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-t pt-3 lg:flex-col lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
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
};

export default MedicineCard;
