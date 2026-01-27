import { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { toast } from 'sonner';
import { InventoryStats } from './InventoryStats';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { MedicinesList } from './MedicinesList';
import AddMedicineForm from './AddMedicineForm';
import EditMedicineForm from './EditMedicineForm';

import {
  useMedications,
  useCreateMedication,
  useUpdateStock,
  useDeleteMedication,
  type FrontendMedicine,
} from '@/hooks/useMedications';

type CompatibleMedicine = FrontendMedicine & {
  description: string;
  dosage: number;
};

export function Inventory() {
  const [activeTab, setActiveTab] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<FrontendMedicine | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const deferredSearch = useDeferredValue(searchTerm);

  const hasLoadedOnce = useRef(false);

  const filters = useMemo(() => {
    const isCategory = activeTab !== 'all' && activeTab !== 'low-stock';

    const normalizedType = isCategory
      ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
      : undefined;

    const trimmedSearch = deferredSearch.trim();

    return {
      search: trimmedSearch ? trimmedSearch : undefined,
      lowStockOnly: activeTab === 'low-stock' ? true : undefined,
      type: normalizedType,
    };
  }, [deferredSearch, activeTab]);

  const {
    medications,
    loading: isLoadingMedications,
    refetch,
  } = useMedications(filters);

  useEffect(() => {
    if (!isLoadingMedications && medications.length > 0) {
      hasLoadedOnce.current = true;
    }
  }, [isLoadingMedications, medications.length]);

  const isSearching = searchTerm.trim() !== '' && searchTerm !== deferredSearch;

  const isContentLoading = isLoadingMedications || isSearching;

  const { createMedication } = useCreateMedication();
  const { updateStock } = useUpdateStock();
  const { deleteMedication } = useDeleteMedication();

  const handleEdit = (id: number) => {
    const medicine = medications.find((m) => m.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsEditFormOpen(true);
    }
  };

  const handleUpdateMedicine = async (
    id: number,
    updatedData: Partial<FrontendMedicine>,
  ) => {
    try {
      if (
        Object.keys(updatedData).length === 1 &&
        updatedData.stock !== undefined
      ) {
        const result = await updateStock(id, updatedData.stock);
        if (result.success) refetch();
      }
    } catch {
      /* empty */
    }
  };

  const handleDelete = async (id: number) => {
    const medicine = medications.find((m) => m.id === id);

    toast('Are you sure you want to delete this medicine?', {
      description: `This will permanently delete ${medicine?.name}`,
      action: {
        label: 'Delete',
        onClick: async () => {
          const result = await deleteMedication(id);
          if (result.success) refetch();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.info('Deletion cancelled'),
      },
    });
  };

  const handleAddMedicine = async (
    newMedicine: Omit<FrontendMedicine, 'id' | 'isLowStock'>,
  ) => {
    const result = await createMedication(newMedicine);
    if (result.success) {
      refetch();
      setIsAddFormOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <InventoryStats />

      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsAddFormOpen(true)}
        isLoading={isSearching}
      />

      <MedicinesList
        medicines={medications as CompatibleMedicine[]}
        loading={isContentLoading}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={() => setIsAddFormOpen(true)}
      />

      <AddMedicineForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAddMedicine={handleAddMedicine as never}
      />

      <EditMedicineForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setSelectedMedicine(null);
        }}
        medicine={
          selectedMedicine
            ? { ...selectedMedicine, description: '', dosage: 0 }
            : null
        }
        onUpdateMedicine={handleUpdateMedicine}
      />
    </div>
  );
}
