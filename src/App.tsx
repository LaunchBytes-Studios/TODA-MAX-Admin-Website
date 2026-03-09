import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import RewardsPage from './pages/RewardsPage';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route
            path="/orders"
            element={<div className="p-6">Orders Page</div>}
          />
          <Route
            path="/chat"
            element={<div className="p-6">Patient Chat Page</div>}
          />
          <Route path="/rewards" element={<RewardsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
