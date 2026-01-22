import { useState } from 'react';
import { toast } from 'sonner';
import { InventoryStats } from './InventoryStats';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { MedicinesList } from './MedicinesList';
import AddMedicineForm from './AddMedicineForm';
import EditMedicineForm from './EditMedicineForm';
import type { Medicine } from '@/data/medicines';
import { initialMedicines } from '@/data/medicines';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);

  // Filter medicines
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    return medicine.category.toLowerCase() === activeTab && matchesSearch;
  });

  // Handlers
  const handleEdit = (id: number) => {
    const medicine = medicines.find((m) => m.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsEditFormOpen(true);
    }
  };

  const handleUpdateMedicine = (id: number, updatedData: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((medicine) => {
        if (medicine.id === id) {
          return { ...medicine, ...updatedData };
        }
        return medicine;
      }),
    );
  };

  const handleDelete = (id: number) => {
    const medicine = medicines.find((m) => m.id === id);

    toast('Are you sure you want to delete this medicine?', {
      description: `This will permanently delete ${medicine?.name}`,
      action: {
        label: 'Delete',
        onClick: () => {
          setMedicines((prev) => prev.filter((m) => m.id !== id));
          toast.success('Medicine deleted successfully', {
            description: `${medicine?.name} has been removed from inventory`,
          });
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

  const handleAddMedicine = (newMedicine: Medicine) => {
    const medicineWithId: Medicine = {
      ...newMedicine,
      id:
        medicines.length > 0 ? Math.max(...medicines.map((m) => m.id)) + 1 : 1,
    };

    setMedicines((prev) => [...prev, medicineWithId]);

    toast.success('Medicine added successfully', {
      description: `${medicineWithId.name} has been added to inventory`,
      action: {
        label: 'Undo',
        onClick: () => {
          setMedicines((prev) =>
            prev.filter((m) => m.id !== medicineWithId.id),
          );
          toast.info('Addition undone', {
            description: 'Medicine has been removed',
          });
        },
      },
    });
  };

  // Calculate stats
  const stats = {
    total: medicines.length,
    lowStock: medicines.filter((m) => m.isLowStock).length,
    outOfStock: medicines.filter((m) => m.stock === 0).length,
    totalStock: medicines.reduce((sum, m) => sum + m.stock, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <InventoryStats {...stats} />

      {/* Search and Filter */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsAddFormOpen(true)}
      />

      {/* Medicines List */}
      <MedicinesList
        medicines={filteredMedicines}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={() => setIsAddFormOpen(true)}
      />

      {/* Forms */}
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
    </div>
  );
}
