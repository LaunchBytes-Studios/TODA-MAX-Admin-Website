import { useState } from 'react';
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
  dosage: string;
};

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<FrontendMedicine | null>(null);

  const { medications, loading, refetch } = useMedications({
    search: searchTerm || undefined,
    lowStockOnly: activeTab === 'low-stock' ? true : undefined,
  });

  const { createMedication } = useCreateMedication();
  const { updateStock } = useUpdateStock();
  const { deleteMedication } = useDeleteMedication();

  const filteredMedicines = medications.filter((medicine) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'low-stock') return medicine.isLowStock;
    return medicine.category.toLowerCase() === activeTab;
  });

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
        if (result.success) {
          refetch();
        }
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
          if (result.success) {
            refetch();
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.info('Deletion cancelled');
        },
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

  const handleSearch = async (search: string) => {
    setSearchTerm(search);
  };

  if (loading && medications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading medications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats - uses its own hook */}
      <InventoryStats />

      {/* Search and Filter */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsAddFormOpen(true)}
      />

      {/* Medicines List */}
      <MedicinesList
        medicines={filteredMedicines as CompatibleMedicine[]}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={() => setIsAddFormOpen(true)}
      />

      {/* Forms */}
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
            ? {
                ...selectedMedicine,
                description: '',
                dosage: '',
              }
            : null
        }
        onUpdateMedicine={handleUpdateMedicine}
      />
    </div>
  );
}
