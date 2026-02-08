import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface DeleteMedicineModalProps {
  isOpen: boolean;
  medicineName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteMedicineModal: React.FC<DeleteMedicineModalProps> = ({
  isOpen,
  medicineName,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen || !medicineName) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Delete Medicine</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isDeleting}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Are you sure you want to delete this medicine?
              </p>
              <p className="mt-2 text-sm text-gray-600">
                This will permanently delete{' '}
                <span className="font-semibold">{medicineName}</span>. This
                action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMedicineModal;
