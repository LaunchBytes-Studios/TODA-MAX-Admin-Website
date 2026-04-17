import {
  AlertTriangle,
  Package,
  TrendingUp,
  MessageSquareWarning,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LowStockCard } from '../components/dashboard/LowStockCard';
import { RegistrationCodes } from '../components/dashboard/RegistrationCodesCard';
import { AnnouncementCard } from '../components/dashboard/AnnouncementCard';
import { useState, useEffect } from 'react';
import { useAlertMedication } from '@/hooks/medication/useAlertMedication';
import { useOrders } from '@/hooks/ordering/useOrders';
import { DashboardSkeleton } from '../components/skeleton/DashboardSkeleton';
import { useNotifications } from '@/contexts/NotificationContext';

export function DashboardPage() {
  const { unreadChats } = useNotifications();
  const [loading, setLoading] = useState(true);

  const { medications, loading: medsLoading } = useAlertMedication();

  const { loading: ordersLoading, stats } = useOrders('all', 'all', '');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const lowStockCount = medications.length;
  const currentOrdersCount = stats.pending + stats.preparing + stats.ready;
  const outForDeliveryCount = stats.ready;

  return (
    <div className="container mx-auto p-6 h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="container mx-auto p-6 space-y-6 overflow-y-auto scrollbar-none">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
                  <span className="text-xl font-xl font-semibold">
                    Low Stock Items
                  </span>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {medsLoading ? '...' : lowStockCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
                  <span className="text-xl font-xl font-semibold">
                    Unread Inquiries
                  </span>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <MessageSquareWarning className="h-6 w-6 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">
                    {unreadChats}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
                  <span className="text-xl font-xl font-semibold">
                    Out For Delivery
                  </span>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    {ordersLoading ? '...' : outForDeliveryCount}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
                  <span className="text-xl font-xl font-semibold">
                    Current Orders
                  </span>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-purple-600">
                    {ordersLoading ? '...' : currentOrdersCount}
                  </p>
                </CardContent>
              </Card>
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
