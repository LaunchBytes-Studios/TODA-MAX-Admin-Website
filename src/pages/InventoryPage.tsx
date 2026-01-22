import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '../components/inventory/InventoryStatsCard';
import MedicineCard from '../components/inventory/MedicineCard';
import AddMedicineForm from '../components/inventory/AddMedicineForm';
import EditMedicineForm from '../components/inventory/EditMedicineForm'; 
import { Button } from '../components/ui/button';

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

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 1,
      name: 'Losartan',
      category: 'Cardiovascular',
      description: 'For high blood pressure (Hypertension)',
      dosage: '50mg',
      stock: 45,
      lowStockThreshold: 10,
      isLowStock: false,
    },
    {
      id: 2,
      name: 'Metformin',
      category: 'Diabetes',
      description: 'For type 2 diabetes',
      dosage: '500mg',
      stock: 15,
      lowStockThreshold: 20,
      isLowStock: true,
    },
  ]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'cardiovascular', label: 'Cardiovascular' },
    { id: 'diabetes', label: 'Diabetes' },
  ];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return medicine.category.toLowerCase() === activeTab && matchesSearch;
  });

  const handleEdit = (id: number) => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsEditFormOpen(true);
    }
  };

  const handleUpdateMedicine = (id: number, updatedData: Partial<Medicine>) => {
    setMedicines(prev => prev.map(medicine => {
      if (medicine.id === id) {
        return { ...medicine, ...updatedData };
      }
      return medicine;
    }));
  };

  const handleDelete = (id: number) => {
    const medicine = medicines.find(m => m.id === id);
    
    toast('Are you sure you want to delete this medicine?', {
      description: `This will permanently delete ${medicine?.name}`,
      action: {
        label: 'Delete',
        onClick: () => {
          setMedicines(prev => prev.filter(m => m.id !== id));
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
      id: medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1,
    };

    setMedicines(prev => [...prev, medicineWithId]);
    
    toast.success('Medicine added successfully', {
      description: `${medicineWithId.name} has been added to inventory`,
      action: {
        label: 'Undo',
        onClick: () => {
          setMedicines(prev => prev.filter(m => m.id !== medicineWithId.id));
          toast.info('Addition undone', {
            description: 'Medicine has been removed',
          });
        },
      },
    });
  };

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(m => m.isLowStock).length;
  const noStockCount = medicines.filter(m => m.stock === 0).length;
  const totalStock = medicines.reduce((sum, m) => sum + m.stock, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Medicines" 
          value={totalMedicines} 
          description="Different types of medicines"
        />
        <StatsCard 
          title="Low Stock" 
          value={lowStockCount} 
          isWarning 
          description="Below threshold"
        />
        <StatsCard 
          title="Out of Stock" 
          value={noStockCount} 
          isDanger 
          description="Zero stock items"
        />
        <StatsCard 
          title="Total Stock" 
          value={totalStock} 
          description="Total units in inventory"
        />
      </div>

      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            <div className="relative md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            onClick={() => setIsAddFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map(medicine => (
            <MedicineCard
              key={medicine.id}
              id={medicine.id}
              name={medicine.name}
              category={medicine.category}
              description={medicine.description}
              dosage={medicine.dosage}
              stock={medicine.stock}
              isLowStock={medicine.isLowStock}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No medicines found for "${searchTerm}"`
                : 'No medicines in this category. Add your first medicine!'}
            </p>
            {!searchTerm && (
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddFormOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Medicine
              </Button>
            )}
          </div>
        )}
      </div>

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
};

export default InventoryPage;