import { Search, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import type { Medicine } from '@/data/medicines';
import MedicineCard from './MedicineCard';
import MedicineCardSkeleton from '../skeleton/MedicineCardSkeleton';

interface MedicinesListProps {
  medicines: Medicine[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddClick: () => void;
}

export function MedicinesList({
  medicines,
  loading,
  onEdit,
  onDelete,
  onAddClick,
}: MedicinesListProps) {
  if (loading && medicines.length > 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <MedicineCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (loading && medicines.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <MedicineCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-gray-400 mb-2">
          <Search className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No medicines found
        </h3>
        <p className="text-gray-600">No medicines found in this category.</p>
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={onAddClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          id={medicine.id}
          name={medicine.name}
          category={medicine.category}
          description={medicine.description}
          dosage={medicine.dosage}
          stock={medicine.stock}
          isLowStock={medicine.isLowStock}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
