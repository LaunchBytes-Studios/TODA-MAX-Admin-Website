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
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Search Bar */}
        <div className="relative md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders or patients..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Delivery Type Filter (Segmented Control) */}
        <div className="flex items-center shrink-0 bg-slate-100 p-1 rounded-lg">
          {DELIVERY_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onDeliveryFilterChange(type.id)}
              className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                deliveryFilter === type.id
                  ? 'text-gray-900 bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Status Tabs (Segmented Control) */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                activeTab === tab.id
                  ? 'text-blue-700 bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
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
