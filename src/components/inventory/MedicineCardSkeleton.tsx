// MedicineCardSkeleton.tsx
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const MedicineCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-100" />
            <Skeleton className="h-4 w-3/4 max-w-75" />
          </div>

          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default MedicineCardSkeleton;
