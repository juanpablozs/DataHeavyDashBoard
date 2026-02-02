import type { OrdersQueryParams, OrdersResponse } from '../types';
import { ordersResponseSchema } from '../schema';

export async function getOrders(params: Partial<OrdersQueryParams>): Promise<OrdersResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.search) searchParams.set('search', params.search);
  if (params.status && params.status.length > 0) {
    searchParams.set('status', params.status.join(','));
  }
  if (params.country) searchParams.set('country', params.country);
  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const response = await fetch(`/api/orders?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const data = await response.json();

  // Validate response with Zod
  return ordersResponseSchema.parse(data);
}
