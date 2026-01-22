import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface Medicine {
  id: number;
  name: string;
  category: string;
  description: string;
  dosage: string;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

interface EditMedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  onUpdateMedicine: (id: number, updatedData: Partial<Medicine>) => void;
}

const EditMedicineForm: React.FC<EditMedicineFormProps> = ({ 
  isOpen, 
  onClose, 
  medicine,
  onUpdateMedicine 
}) => {
  const [stockValue, setStockValue] = useState(medicine?.stock || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (medicine) {
      setStockValue(medicine.stock);
    }
  }, [medicine]);

  const handleDecrement = () => {
    if (stockValue > 0) {
      setStockValue(prev => prev - 1);
    }
  };

  const handleIncrement = () => {
    setStockValue(prev => prev + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setStockValue(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicine) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedData = {
        stock: stockValue,
        isLowStock: stockValue <= medicine.lowStockThreshold
      };

      onUpdateMedicine(medicine.id, updatedData);
      
      toast.success('Stock updated successfully', {
        description: `Stock for ${medicine.name} has been updated to ${stockValue}`,
      });
      
      onClose();
    } catch {
      toast.error('Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Adjust Stock</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adjust stock for &quot;<span className="font-medium">{medicine.name}</span>&quot;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={stockValue === 0}
                  className={`p-3 rounded-full ${
                    stockValue === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  aria-label="Decrease stock by 1"
                >
                  <Minus className="w-6 h-6" />
                </button>

                <div className="min-w-30">
                  <div className="text-4xl font-bold text-gray-900">{stockValue}</div>
                  <div className="text-sm text-gray-500 mt-1">Current stock</div>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                  aria-label="Increase stock by 1"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter stock manually
                </label>
                <input
                  type="number"
                  value={stockValue}
                  onChange={handleInputChange}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-md text-center text-lg font-medium"
                  min="0"
                />
              </div>

              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Previous stock:</span>
                  <span className="font-medium">{medicine.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Change:</span>
                  <span className={`font-medium ${stockValue - medicine.stock >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockValue - medicine.stock >= 0 ? '+' : ''}{stockValue - medicine.stock}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Low stock threshold:</span>
                  <span className="font-medium">{medicine.lowStockThreshold}</span>
                </div>
                {stockValue <= medicine.lowStockThreshold && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    ⚠️ Stock is at or below low stock threshold
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || stockValue === medicine.stock}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicineForm;