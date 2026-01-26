import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  Gift,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

export interface NavItemType {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItemType[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Patient Chat', path: '/chat', icon: MessageSquare },
  { name: 'Rewards', path: '/rewards', icon: Gift },
];

export const LOGOUT_ITEM = {
  name: 'Logout',
  icon: LogOut,
};
