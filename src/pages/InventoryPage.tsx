import { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { toast } from 'sonner';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import { SearchAndFilterBar } from '@/components/inventory/SearchAndFilterBar';
import { MedicinesList } from '@/components/inventory/MedicinesList';
import AddMedicineForm from '@/components/inventory/AddMedicineForm';
import EditMedicineForm from '@/components/inventory/EditMedicineForm';
import DeleteMedicineModal from '@/components/inventory/DeleteMedicineModal';

import { useCreateMedication } from '@/hooks/medications/useCreateMedication';
import { useDeleteMedication } from '@/hooks/medications/useDeleteMedication';
import { useFetchMedications } from '@/hooks/medications/useFetchMedications';
import { useMedicationStats } from '@/hooks/medications/useMedicationStats';
import type { FrontendMedicine } from '@/types/medication';

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<FrontendMedicine | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] =
    useState<FrontendMedicine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
  } = useFetchMedications(filters);

  const { refetch: refetchStats } = useMedicationStats();

  useEffect(() => {
    if (!isLoadingMedications && medications.length > 0) {
      hasLoadedOnce.current = true;
    }
  }, [isLoadingMedications, medications.length]);

  const isSearching = searchTerm.trim() !== '' && searchTerm !== deferredSearch;

  const isContentLoading = isLoadingMedications || isSearching;

  const { createMedication } = useCreateMedication();
  const { deleteMedication } = useDeleteMedication();

  const handleEdit = (id: number) => {
    const medicine = medications.find((m) => m.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsEditFormOpen(true);
    }
  };

  const handleUpdateMedicine = async () => {
    try {
      refetch();
      refetchStats();
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      /* empty */
    }
  };

  const handleDelete = async (id: number) => {
    const medicine = medications.find((m) => m.id === id);
    if (medicine) {
      setMedicineToDelete(medicine);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!medicineToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteMedication(medicineToDelete.id);
      if (result.success) {
        toast.success('Medicine deleted successfully');
        refetch();
        refetchStats();
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(result.error || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast.error('Failed to delete medicine');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setMedicineToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMedicineToDelete(null);
  };

  const handleAddMedicine = async (
    newMedicine: Omit<FrontendMedicine, 'id' | 'isLowStock'>,
  ) => {
    const result = await createMedication(newMedicine);
    if (result.success) {
      refetch();
      refetchStats();
      setRefreshTrigger((prev) => prev + 1);
      setIsAddFormOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      </div>
      <div className="space-y-6">
        <InventoryStats refreshTrigger={refreshTrigger} />

        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddClick={() => setIsAddFormOpen(true)}
          isLoading={isSearching}
        />

        <MedicinesList
          medicines={medications}
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
          medicine={selectedMedicine}
          onUpdateMedicine={handleUpdateMedicine}
        />

        <DeleteMedicineModal
          isOpen={isDeleteModalOpen}
          medicineName={medicineToDelete?.name || null}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}

export default InventoryPage;
