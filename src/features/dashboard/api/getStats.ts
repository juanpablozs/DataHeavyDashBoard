import { z } from 'zod';
import type { DashboardStats } from '../types';

const statsResponseSchema = z.object({
  totalOrders: z.number(),
  totalRevenue: z.number(),
  ordersToday: z.number(),
  refundsCount: z.number(),
  ordersByStatus: z.record(z.number()),
  revenueOverTime: z.array(
    z.object({
      date: z.string(),
      revenue: z.number(),
    })
  ),
});

export async function getStats(): Promise<DashboardStats> {
  const response = await fetch('/api/stats');

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  const data = await response.json();

  // Validate with Zod
  return statsResponseSchema.parse(data);
}
