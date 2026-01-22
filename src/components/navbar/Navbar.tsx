import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import NavItem from './NavItem';
import { NAV_ITEMS, LOGOUT_ITEM } from '../../constants/navigation';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="TODA MAX Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-900">TODA MAX</h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.name}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                  isActive={location.pathname.startsWith(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
            
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LOGOUT_ITEM.icon className="w-4 h-4" />
              {LOGOUT_ITEM.name}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;