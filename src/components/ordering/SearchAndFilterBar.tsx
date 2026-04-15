import { Search } from 'lucide-react';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  deliveryFilter: string;
  onDeliveryFilterChange: (value: string) => void;
}

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
];

const DELIVERY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'delivery', label: 'For Delivery' },
  { id: 'pickup', label: 'For Pickup' },
];

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  deliveryFilter,
  onDeliveryFilterChange,
}: SearchAndFilterBarProps) {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Bar */}
        <div className="relative md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders or patients..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Delivery Type Filter */}
        <div className="flex items-center gap-2 shrink-0">
          {DELIVERY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onDeliveryFilterChange(type.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                deliveryFilter === type.id
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
    </div>
  );
}
