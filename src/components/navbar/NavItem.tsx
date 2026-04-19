import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  name: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  badge: number;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  icon: Icon,
  isActive,
  onClick,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {name}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

export default NavItem;
