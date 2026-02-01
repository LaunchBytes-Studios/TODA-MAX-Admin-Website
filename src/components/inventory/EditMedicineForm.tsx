import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useUpdateMedication } from '@/hooks/useMedications';

interface Medicine {
  id: number;
  name: string;
  category: string;
  description: string;
  dosage: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  price?: number;
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
  onUpdateMedicine,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stock: 0,
    lowStockThreshold: 10,
    dosage: 0,
    price: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = ['Hypertension', 'Diabetes'];
  const { updateMedication, loading } = useUpdateMedication();

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        description: medicine.description,
        category: medicine.category,
        stock: medicine.stock,
        lowStockThreshold: medicine.lowStockThreshold,
        dosage: medicine.dosage,
        price: medicine.price || 0,
      });
    }
  }, [medicine]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'stock' ||
        name === 'lowStockThreshold' ||
        name === 'price' ||
        name === 'dosage'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!medicine) {
      toast.error('No medicine selected');
      setIsSubmitting(false);
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter medicine name');
      setIsSubmitting(false);
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      setIsSubmitting(false);
      return;
    }

    if (formData.price <= 0) {
      toast.error('Please enter a valid price');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updateMedication(medicine.id, {
        name: formData.name,
        category: formData.category,
        stock: formData.stock,
        lowStockThreshold: formData.lowStockThreshold,
        dosage: formData.dosage,
        price: formData.price,
        description: formData.description,
      });

      if (result.success) {
        toast.success('Medicine updated successfully');
        onUpdateMedicine(medicine.id, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          stock: formData.stock,
          lowStockThreshold: formData.lowStockThreshold,
          dosage: formData.dosage,
          price: formData.price,
        });
        onClose();
      } else {
        toast.error(result.error || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast.error('Failed to update medicine');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Medicine</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isSubmitting || loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter medicine name"
              required
              disabled={isSubmitting || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
              rows={2}
              disabled={isSubmitting || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting || loading}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={isSubmitting || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              disabled={isSubmitting || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Low Stock Threshold
            </label>
            <input
              type="number"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              disabled={isSubmitting || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Dosage
            </label>
            <input
              type="number"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 50mg"
              disabled={isSubmitting || loading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicineForm;
