import { useState, useMemo, useDeferredValue } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import { SearchAndFilterBar } from '@/components/inventory/SearchAndFilterBar';
import { MedicinesList } from '@/components/inventory/MedicinesList';
import AddMedicineForm from '@/components/inventory/AddMedicineForm';
import EditMedicineForm from '@/components/inventory/EditMedicineForm';
import DeleteMedicineModal from '@/components/inventory/DeleteMedicineModal';

import { useCreateMedication } from '@/hooks/medications/useCreateMedication';
import { useDeleteMedication } from '@/hooks/medications/useDeleteMedication';
import { useFetchMedications } from '@/hooks/medications/useFetchMedications';
import type { FrontendMedicine } from '@/types/medication';
import { INVENTORY_FILTER_GROUPS } from '@/constants/tabs';

const GROUP_ALL_PREFIX = 'all:';
const QUANTITY_FILTER_IDS = ['out-of-stock', 'low-stock', 'in-stock'];

export function InventoryPage() {
  const location = useLocation();
  const initialFilters =
    (location.state as { tab?: string } | null)?.tab === 'low-stock'
      ? ['low-stock']
      : [];
  const [selectedFilters, setSelectedFilters] =
    useState<string[]>(initialFilters);
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

  const filters = useMemo(() => {
    const trimmedSearch = deferredSearch.trim();

    return {
      search: trimmedSearch ? trimmedSearch : undefined,
      page: 1,
      limit: 100,
    };
  }, [deferredSearch]);

  const {
    medications,
    loading: isLoadingMedications,
    refetch,
  } = useFetchMedications(filters);

  const selectedTypeFilters = useMemo(
    () =>
      selectedFilters.filter(
        (filterId) =>
          !filterId.startsWith(GROUP_ALL_PREFIX) &&
          !QUANTITY_FILTER_IDS.includes(filterId),
      ),
    [selectedFilters],
  );

  const selectedQuantityFilters = useMemo(
    () =>
      selectedFilters.filter(
        (filterId) =>
          !filterId.startsWith(GROUP_ALL_PREFIX) &&
          QUANTITY_FILTER_IDS.includes(filterId),
      ),
    [selectedFilters],
  );

  const filteredMedications = useMemo(() => {
    return medications.filter((medicine) => {
      const matchesType =
        selectedTypeFilters.length === 0 ||
        selectedTypeFilters.includes(medicine.category.toLowerCase());

      const isOutOfStock = medicine.stock === 0;
      const isLowStock =
        medicine.stock > 0 && medicine.stock <= medicine.lowStockThreshold;
      const isInStock = medicine.stock > medicine.lowStockThreshold;
      const matchesQuantity =
        selectedQuantityFilters.length === 0 ||
        (selectedQuantityFilters.includes('out-of-stock') && isOutOfStock) ||
        (selectedQuantityFilters.includes('low-stock') && isLowStock) ||
        (selectedQuantityFilters.includes('in-stock') && isInStock);

      return matchesType && matchesQuantity;
    });
  }, [medications, selectedTypeFilters, selectedQuantityFilters]);

  const isSearching = searchTerm.trim() !== '' && searchTerm !== deferredSearch;

  const isContentLoading = isLoadingMedications || isSearching;

  const { createMedication } = useCreateMedication();
  const { deleteMedication } = useDeleteMedication();

  const handleEdit = (id: number) => {
    const medicine = filteredMedications.find((m) => m.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsEditFormOpen(true);
    }
  };

  const handleUpdateMedicine = async () => {
    try {
      await refetch();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error refreshing medications:', error);
      toast.error('Failed to refresh medications');
    }
  };

  const handleDelete = async (id: number) => {
    const medicine = filteredMedications.find((m) => m.id === id);
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
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          filterOptionGroups={INVENTORY_FILTER_GROUPS}
          onAddClick={() => setIsAddFormOpen(true)}
          isLoading={isSearching}
        />

        <MedicinesList
          medicines={filteredMedications}
          loading={isContentLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={() => setIsAddFormOpen(true)}
        />

        <AddMedicineForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onAddMedicine={handleAddMedicine}
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
