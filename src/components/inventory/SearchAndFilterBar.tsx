import { Search, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TABS } from '../../constants/tabs';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onAddClick: () => void;
}

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onAddClick,
}: SearchAndFilterBarProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          <div className="relative md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

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

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          onClick={onAddClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>
    </div>
  );
}
