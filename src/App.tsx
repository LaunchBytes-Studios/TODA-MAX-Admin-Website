import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import RewardsPage from './pages/RewardsPage';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import OrderingPage from './pages/OrderingPage';
import { SupportPage } from './pages/SupportPage';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrderingPage />} />
          <Route path="/chat" element={<SupportPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
