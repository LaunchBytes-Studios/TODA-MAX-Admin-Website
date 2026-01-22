import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface MedicineCardProps {
  id: number;
  name: string;
  category: string;
  description: string;
  dosage: string;
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
            <p className={isLowStock ? 'text-black' : 'text-black-700'}>
              <span className="font-medium">Current Stock:</span> {stock}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(id)}
            className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:text-white"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(id)}
            className="bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
