import { StatsCards } from '../stats-card';
import { LowStockTable } from '../low-stock';
import { RegistrationCodes } from '../registration-codes';
import { BroadcastAlert } from '../broadcast-alert';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from './DashboardSkeleton';

export function Dashboard() {
  // Simulate loading state for skeleton
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-y-auto scrollbar-none">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockTable />
            <RegistrationCodes />
          </div>
          <BroadcastAlert />
        </>
      )}
    </div>
  );
}
