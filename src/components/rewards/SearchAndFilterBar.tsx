import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onAddClick: () => void;
  isLoading?: boolean;
}

const REWARD_TABS = [
  { id: 'all', label: 'All' },
  { id: 'discount', label: 'Discount' },
  { id: 'gift', label: 'Gift' },
  { id: 'service', label: 'Service' },
  { id: 'health', label: 'Health' },
  { id: 'low-stock', label: 'Low Stock Alert' },
];

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onAddClick,
  isLoading = false,
}: SearchAndFilterBarProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          <div className="relative md:w-64">
            {isLoading ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            )}
            <input
              type="text"
              placeholder="Search rewards..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {REWARD_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          onClick={onAddClick}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reward
        </Button>
      </div>
    </div>
  );
}
