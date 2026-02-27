import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderingPageSkeleton } from '@/components/skeleton/OrderingPageSkeleton';
import axios from 'axios';

interface Order {
  id: string;
  order_number: string;
  patient_name: string;
  created_at: string;
  amount: string | number;
  status: string;
  delivery_type: string;
}

export default function OrderingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    newOrders: 0,
    preparing: 0,
    outForDelivery: 0,
    past: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, statsRes] = await Promise.all([
          axios.get('http://localhost:3001/api/orders/summary'),
          axios.get('http://localhost:3001/api/orders/stats'),
        ]);
        setOrders(summaryRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredOrders = () => {
    const statusMap: Record<string, string[]> = {
      new: ['new', 'pending'],
      preparing: ['preparing'],
      out: ['out_for_delivery', 'shipped'],
      past: ['completed', 'delivered', 'cancelled', 'past'],
    };

    const allowed = statusMap[activeTab] || [];
    return orders.filter((o) => allowed.includes(o.status?.toLowerCase()));
  };

  if (loading) return <OrderingPageSkeleton />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>Total Orders</CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>New Orders</CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {stats.newOrders}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Out for Delivery</CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {stats.outForDelivery}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Input
          placeholder="Search orders or patients..."
          className="max-w-sm"
        />
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
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

      {/* Order List */}
      <div className="space-y-4">
        {getFilteredOrders().map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-medium">Order No. {order.order_number}</p>
                <p className="text-lg font-semibold">{order.patient_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleString('en-PH', {
                    timeZone: 'Asia/Manila',
                  })}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-xl font-bold text-green-700">
                  ₱{Number(order.amount).toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      order.status === 'new'
                        ? 'destructive'
                        : order.status === 'preparing'
                          ? 'secondary'
                          : order.status === 'out_for_delivery'
                            ? 'default'
                            : 'outline'
                    }
                  >
                    {order.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge
                    variant={
                      order.delivery_type === 'delivery'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {order.delivery_type === 'delivery'
                      ? 'For Delivery'
                      : 'For Pickup'}
                  </Badge>
                  <Button size="sm">Details</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
