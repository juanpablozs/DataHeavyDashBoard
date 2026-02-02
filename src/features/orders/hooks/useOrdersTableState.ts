import { useUrlState, urlStateHelpers } from '@/lib/urlState';
import type { OrdersQueryParams, OrderStatus } from '../types';

/**
 * Hook to manage orders table state synchronized with URL
 * All filters, pagination, and sorting are reflected in the URL
 */
export function useOrdersTableState() {
  const { params, setParam, setParams, resetParams } = useUrlState<
    Omit<OrdersQueryParams, 'status'> & { status: string[] }
  >({
    page: {
      default: 1,
      ...urlStateHelpers.number,
    },
    pageSize: {
      default: 20,
      ...urlStateHelpers.number,
    },
    search: {
      default: '',
    },
    status: {
      default: [],
      ...urlStateHelpers.stringArray,
    },
    country: {
      default: '',
    },
    from: {
      default: '',
    },
    to: {
      default: '',
    },
    sortBy: {
      default: 'createdAt',
    },
    sortOrder: {
      default: 'desc',
      serialize: (v) => v,
      deserialize: (v) => (v === 'asc' || v === 'desc' ? v : 'desc'),
    },
  });

  // Convert status string[] to OrderStatus[] for type safety
  const queryParams: OrdersQueryParams = {
    ...params,
    status: params.status as OrderStatus[],
  };

  return {
    queryParams,
    setPage: (page: number) => setParam('page', page),
    setPageSize: (pageSize: number) => setParams({ pageSize, page: 1 }),
    setSearch: (search: string) => setParams({ search, page: 1 }),
    setStatus: (status: OrderStatus[]) => setParams({ status, page: 1 }),
    setCountry: (country: string) => setParams({ country, page: 1 }),
    setDateRange: (from: string, to: string) => setParams({ from, to, page: 1 }),
    setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => setParams({ sortBy, sortOrder }),
    resetFilters: resetParams,
  };
}
