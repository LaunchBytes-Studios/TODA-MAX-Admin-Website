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
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{name}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
              {category}
            </span>
            {isLowStock && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-orange-600">
                Low Stock
              </span>
            )}
          </div>
          <p className="text-gray-600">{description}</p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Dosage:</span> {dosage}
            </p>
            <p className={isLowStock ? 'text-orange-600' : 'text-gray-700'}>
              <span className="font-medium">Current Stock:</span> {stock}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
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
