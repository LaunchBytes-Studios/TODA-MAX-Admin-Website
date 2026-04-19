import { useEffect, useState } from 'react';
import { eventBus } from '@/utils/eventBus';
import { toast } from 'sonner';
import { NotificationContext } from '@/contexts/NotificationContext';
import type { Message } from '@/types/chat';
import type { Order } from '@/types/order';
import { supabase } from '@/lib/supabaseClient';

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadChats, setUnreadChats] = useState(0);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      const { data } = await supabase.rpc('get_total_unread');
      setUnreadChats(data ?? 0);
    };

    fetchUnreadChats();
  }, []);

  useEffect(() => {
    const unsubChat = eventBus.on('chat:new-message', (msg: Message) => {
      if (msg.role !== 'patient') return;

      const isOnSupportPage = location.pathname.startsWith('/chat');

      if (isOnSupportPage) return;

      setUnreadChats((prev) => prev + 1);

      toast.info('New Message', {
        description: msg.content
          ? `${msg.content.slice(0, 45)}${msg.content.length > 45 ? '...' : ''}`
          : 'New message',
      });
    });

    const unsubOrder = eventBus.on('order:new', (order: Order) => {
      const isOnOrdersPage = location.pathname.startsWith('/orders');

      if (isOnOrdersPage) return;

      setNewOrders((prev) => prev + 1);

      toast.success('New Order', {
        description: `Order #${order.order_id?.slice(0, 8).toUpperCase()}`,
      });
    });

    return () => {
      unsubChat();
      unsubOrder();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadChats,
        newOrders,
        resetChats: () => setUnreadChats(0),
        resetOrders: () => setNewOrders(0),

        updateUnreadChats: (value: number) => setUnreadChats(value),
        updateNewOrders: (value: number) => setNewOrders(value),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
