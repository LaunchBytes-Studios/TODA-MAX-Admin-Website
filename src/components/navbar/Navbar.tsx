import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../../assets/logo.png';
import NavItem from './NavItem';
import { NAV_ITEMS, LOGOUT_ITEM } from '../../constants/navigation';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    toast.success('Logged out successfully!', {
      style: {
        background: '#f0fdf4',
        color: '#16a34a',
        border: '1px solid #bbf7d0',
      },
    });

    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
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
                onClick={confirmLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LOGOUT_ITEM.icon className="w-4 h-4" />
                {LOGOUT_ITEM.name}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Confirm Logout</h2>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
                <LOGOUT_ITEM.icon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                You will be logged out of your account and redirected to the
                login page.
              </p>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
