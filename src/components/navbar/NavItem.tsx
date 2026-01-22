import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  icon: Icon,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {name}
    </button>
  );
};

export default NavItem;
