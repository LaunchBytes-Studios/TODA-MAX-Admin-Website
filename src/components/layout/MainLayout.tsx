import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;