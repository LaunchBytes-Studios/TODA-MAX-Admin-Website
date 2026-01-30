import { AlertTriangle, Package, Clock, TrendingUp } from 'lucide-react'; // or your icon library
import { StatsCard } from '@/components/ui/stats-card';
import { LowStockCard } from '../components/dashboard/LowStockCard';
import { RegistrationCodes } from '../components/dashboard/RegistrationCodesCard';
import { AnnouncementCard } from '../components/dashboard/AnnouncementCard';
import { useState, useEffect } from 'react';
import { useAlertMedication } from '@/hooks/useAlertMedication';
import { DashboardSkeleton } from '../components/skeleton/DashboardSkeleton';

export function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const { medications, loading: medsLoading } = useAlertMedication();
  const lowStockCount = medications.length;

  return (
    <div className="container mx-auto p-6 h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="container mx-auto p-6 space-y-6 overflow-y-auto scrollbar-none">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Low Stock Items"
                value={medsLoading ? '...' : lowStockCount}
                icon={<AlertTriangle />}
                iconBgClassName="bg-orange-50"
                iconColorClassName="text-orange-500"
              />
              <StatsCard
                title="Unread Inquiries"
                value={6}
                icon={<Package />}
                iconBgClassName="bg-blue-50"
                iconColorClassName="text-blue-500"
              />
              <StatsCard
                title="Current Orders"
                value={1}
                icon={<Clock />}
                iconBgClassName="bg-red-50"
                iconColorClassName="text-red-500"
              />
              <StatsCard
                title="Out For Delivery"
                value="1,320"
                icon={<TrendingUp />}
                iconBgClassName="bg-green-50"
                iconColorClassName="text-green-500"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LowStockCard />
              <RegistrationCodes />
            </div>
            <AnnouncementCard />
          </>
        )}
      </div>
    </div>
  );
}
export default DashboardPage;
