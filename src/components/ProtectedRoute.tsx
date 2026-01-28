import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
