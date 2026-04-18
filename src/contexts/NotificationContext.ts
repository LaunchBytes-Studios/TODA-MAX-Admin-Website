import { createContext, useContext } from 'react';

export interface NotificationContextType {
  unreadChats: number;
  newOrders: number;
  resetChats: () => void;
  resetOrders: () => void;
  updateNewOrders: (newValue: number) => void;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within provider');
  return ctx;
};
