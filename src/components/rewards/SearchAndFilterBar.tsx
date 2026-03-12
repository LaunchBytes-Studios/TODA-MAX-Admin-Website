import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FilterModal,
  type FilterOptionGroup,
} from '@/components/ui/filter-modal';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilters: string[];
  onFiltersChange: (filterIds: string[]) => void;
  filterOptionGroups: FilterOptionGroup[];
  onAddClick: () => void;
  isLoading?: boolean;
}

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
  filterOptionGroups,
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

          <FilterModal
            title="Filter Rewards"
            description="Select one or more tags by section to refine results."
            optionGroups={filterOptionGroups}
            selectedValues={selectedFilters}
            onApply={onFiltersChange}
            disabled={isLoading}
          />
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
