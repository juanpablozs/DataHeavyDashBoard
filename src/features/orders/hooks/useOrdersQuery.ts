import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../api/getOrders';
import type { OrdersQueryParams } from '../types';

export function useOrdersQuery(params: OrdersQueryParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}
