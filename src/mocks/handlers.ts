import { http, HttpResponse, delay } from 'msw';
import { mockOrders, getOrderWithItems } from './dataGenerator';
import type { Order, OrdersResponse, StatsResponse } from './db';

/**
 * Configuration for mock API behavior
 */
const config = {
  latency: { min: 100, max: 500 }, // Realistic latency
  errorRate: 0.0, // 0% error rate by default (can be toggled)
};

/**
 * Helper to simulate occasional errors
 */
async function simulateLatencyAndErrors() {
  const latency = config.latency.min + Math.random() * (config.latency.max - config.latency.min);
  await delay(latency);

  if (Math.random() < config.errorRate) {
    return HttpResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    );
  }

  return null;
}

/**
 * Filter orders based on query params
 */
function filterOrders(
  orders: Order[],
  params: {
    search?: string;
    status?: string[];
    country?: string;
    from?: string;
    to?: string;
  }
): Order[] {
  let filtered = [...orders];

  // Search by customer name or email
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (params.status && params.status.length > 0) {
    filtered = filtered.filter((order) => params.status!.includes(order.status));
  }

  // Filter by country
  if (params.country) {
    filtered = filtered.filter((order) => order.country === params.country);
  }

  // Filter by date range
  if (params.from) {
    const fromDate = new Date(params.from).getTime();
    filtered = filtered.filter((order) => new Date(order.createdAt).getTime() >= fromDate);
  }

  if (params.to) {
    const toDate = new Date(params.to).getTime();
    filtered = filtered.filter((order) => new Date(order.createdAt).getTime() <= toDate);
  }

  return filtered;
}

/**
 * Sort orders
 */
function sortOrders(orders: Order[], sortBy?: string, sortOrder?: 'asc' | 'desc'): Order[] {
  if (!sortBy) return orders;

  const sorted = [...orders].sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    if (sortBy === 'createdAt') {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    } else if (sortBy === 'total') {
      aVal = a.total;
      bVal = b.total;
    } else if (sortBy === 'customerName') {
      aVal = a.customerName;
      bVal = b.customerName;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * API Handlers
 */
export const handlers = [
  // GET /api/orders - List orders with filtering, sorting, pagination
  http.get('/api/orders', async ({ request }) => {
    const error = await simulateLatencyAndErrors();
    if (error) return error;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const search = url.searchParams.get('search') || undefined;
    const statusParam = url.searchParams.get('status');
    const status = statusParam ? statusParam.split(',') : undefined;
    const country = url.searchParams.get('country') || undefined;
    const from = url.searchParams.get('from') || undefined;
    const to = url.searchParams.get('to') || undefined;
    const sortBy = url.searchParams.get('sortBy') || undefined;
    const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Filter and sort
    let filtered = filterOrders(mockOrders, { search, status, country, from, to });
    filtered = sortOrders(filtered, sortBy, sortOrder);

    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filtered.slice(start, end);

    const response: OrdersResponse = {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  // GET /api/orders/:id - Get single order with items
  http.get('/api/orders/:id', async ({ params }) => {
    const error = await simulateLatencyAndErrors();
    if (error) return error;

    const { id } = params;
    const orderWithItems = getOrderWithItems(mockOrders, id as string);

    if (!orderWithItems) {
      return HttpResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return HttpResponse.json(orderWithItems);
  }),

  // GET /api/stats - Dashboard statistics
  http.get('/api/stats', async () => {
    const error = await simulateLatencyAndErrors();
    if (error) return error;

    const now = Date.now();
    const todayStart = new Date(now).setHours(0, 0, 0, 0);

    // Calculate stats
    const totalOrders = mockOrders.length;
    const totalRevenue = mockOrders.reduce((sum, order) => {
      // Convert EUR to USD for aggregation (simplified)
      const amount = order.currency === 'EUR' ? order.total * 1.1 : order.total;
      return sum + amount;
    }, 0);

    const ordersToday = mockOrders.filter(
      (order) => new Date(order.createdAt).getTime() >= todayStart
    ).length;

    const refundsCount = mockOrders.filter((order) => order.status === 'refunded').length;

    // Orders by status
    const ordersByStatus: Record<string, number> = {};
    mockOrders.forEach((order) => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Revenue over time (last 30 days)
    const revenueOverTime: Array<{ date: string; revenue: number }> = [];
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayStart = date.setHours(0, 0, 0, 0);
      const dayEnd = date.setHours(23, 59, 59, 999);

      const revenue = mockOrders
        .filter((order) => {
          const orderTime = new Date(order.createdAt).getTime();
          return orderTime >= dayStart && orderTime <= dayEnd;
        })
        .reduce((sum, order) => {
          const amount = order.currency === 'EUR' ? order.total * 1.1 : order.total;
          return sum + amount;
        }, 0);

      revenueOverTime.push({ date: dateStr, revenue });
    }

    const response: StatsResponse = {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      ordersToday,
      refundsCount,
      ordersByStatus,
      revenueOverTime,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/login - Fake login
  http.post('/api/login', async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as { email: string; password: string };

    // Accept any credentials for demo
    if (body.email && body.password) {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        user: {
          email: body.email,
          name: body.email.split('@')[0],
        },
      });
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),
];

// Export function to toggle error rate for testing
export function setErrorRate(rate: number) {
  config.errorRate = Math.max(0, Math.min(1, rate));
}
