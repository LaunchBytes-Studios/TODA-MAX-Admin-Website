import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
}: SearchAndFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Input
        placeholder="Search orders or patients..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-5 sm:w-auto">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="out">Out for Delivery</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
