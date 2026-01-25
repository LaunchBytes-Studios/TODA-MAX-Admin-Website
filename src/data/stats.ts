import { TrendingUp, Package, Clock, AlertTriangle } from 'lucide-react';
import { lowStockItems } from '@/data/lowStock';

export const stats = [
  {
    title: 'Low Stock Items',
    value: lowStockItems.length.toString(),
    icon: AlertTriangle,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    title: 'Unread Inquires',
    value: '6',
    icon: Package,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Current Orders',
    value: '1',
    icon: Clock,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    title: 'Out For Delivery',
    value: '1,320',
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];
