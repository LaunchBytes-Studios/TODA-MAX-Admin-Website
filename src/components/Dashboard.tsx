import { StatsCards } from './StatsCard';
import { LowStockTable } from './LowStock';
import { RegistrationCodes } from './RegistrationCodes';
import { BroadcastAlert } from './BroadcastAlert';

export function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6 overflow-y-auto scrollbar-none">
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockTable />
        <RegistrationCodes />
      </div>

      <BroadcastAlert />
    </div>
  );
}
