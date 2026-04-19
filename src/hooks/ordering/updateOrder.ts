import { api } from '@/api/client';
import type { OrderStatus } from '@/types/order';

export async function updateOrderStatusApi(
  orderId: string,
  status: OrderStatus,
) {
  try {
    const token = localStorage.getItem('token');

    // orderId MUST be the full UUID (e.g. 550e8400-e29b...)
    const response = await api.patch(
      `/enavigator/orders/${orderId}/status`, // Ensure this path matches server.ts + router.ts
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    let errorMessage = 'Failed to update order status';

    if (error instanceof Error) {
      errorMessage = error.message;

      if ('response' in error) {
        const responseData = (error as Record<string, unknown>)
          .response as Record<string, unknown>;
        const message = responseData?.data as Record<string, unknown>;
        if (message?.message) {
          errorMessage = String(message.message);
        }
      }
    }

    return { success: false, data: { message: errorMessage } };
  }
}
