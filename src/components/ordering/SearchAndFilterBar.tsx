import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  stats: {
    total: number;
    newOrders: number;
    preparing: number;
    outForDelivery: number;
  };
}

export function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  stats,
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
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="new">New ({stats.newOrders})</TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing ({stats.preparing})
          </TabsTrigger>
          <TabsTrigger value="out">
            Out for Delivery ({stats.outForDelivery})
          </TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
