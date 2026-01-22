import { Inventory } from '@/components/inventory/Inventory';

export function InventoryPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
      </div>
      <Inventory />
    </div>
  );
}

export default InventoryPage;
