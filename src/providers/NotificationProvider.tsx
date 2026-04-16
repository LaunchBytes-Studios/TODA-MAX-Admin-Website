import { useEffect, useState } from 'react';
import { eventBus } from '@/utils/eventBus';
import { toast } from 'sonner';
import { NotificationContext } from '@/contexts/NotificationContext';
import type { Message } from '@/types/chat';
import type { Order } from '@/types/order';

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadChats, setUnreadChats] = useState(0);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    console.log('NotificationProvider mounted');

    const unsubChat = eventBus.on('chat:new-message', (msg: Message) => {
      console.log('CHAT EVENT RECEIVED', msg);

      setUnreadChats((prev) => {
        console.log('prev chats:', prev);
        return prev + 1;
      });

      toast.info('New Message', {
        description: msg.content?.slice(0, 30) || 'New message',
      });
    });

    const unsubOrder = eventBus.on('order:new', (order: Order) => {
      console.log('ORDER EVENT RECEIVED', order);

      setNewOrders((prev) => {
        console.log('prev orders:', prev);
        return prev + 1;
      });

      toast.success('New Order', {
        description: `Order #${order.order_id?.slice(0, 8)}`,
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
