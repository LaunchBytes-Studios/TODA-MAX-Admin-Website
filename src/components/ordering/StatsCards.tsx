import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, Box, Package } from 'lucide-react';

interface StatsCardsProps {
  total: number;
  newOrders: number;
  preparing: number;
  ready: number;
}

export function StatsCards({
  total,
  newOrders,
  preparing,
  ready,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
          <span className="text-xl font-xl font-semibold">Current Orders</span>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{total}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
          <span className="text-sm font-medium">New Orders</span>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Box className="h-6 w-6 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{newOrders}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
          <span className="text-xl font-xl font-semibold">
            Preparing Orders
          </span>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <Package className="h-6 w-6 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-yellow-600">{preparing}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0! pb-2">
          <span className="text-xl font-xl font-semibold">Ready Orders</span>
          <div className="bg-green-50 p-3 rounded-lg">
            <Package className="h-6 w-6 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600">{ready}</p>
        </CardContent>
      </Card>
    </div>
  );
}
