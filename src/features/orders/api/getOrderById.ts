import type { OrderDetail } from '../types';
import { orderDetailSchema } from '../schema';

export async function getOrderById(id: string): Promise<OrderDetail> {
  const response = await fetch(`/api/orders/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    throw new Error('Failed to fetch order');
  }

  const data = await response.json();

  // Validate response with Zod
  return orderDetailSchema.parse(data);
}
