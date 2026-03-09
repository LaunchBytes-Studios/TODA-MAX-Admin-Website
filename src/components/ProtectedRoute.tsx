import React from 'react';
import { Navigate } from 'react-router-dom';

let currentTimeMs = new Date().getTime();

if (typeof window !== 'undefined') {
  window.setInterval(() => {
    currentTimeMs = new Date().getTime();
  }, 1000);
}

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const isTokenExpired = (jwt: string) => {
    try {
      const payloadBase64 = jwt.split('.')[1];
      if (!payloadBase64) return true;

      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/'),
      );
      const payload = JSON.parse(payloadJson) as { exp?: number };

      if (!payload.exp) return true;
      return payload.exp * 1000 <= currentTimeMs;
    } catch {
      return true;
    }
  };

  if (!token || !isAuthenticated) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired(token)) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  return children;
};
