import { z } from 'zod';

/**
 * Order schema validation
 */
export const orderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  status: z.enum(['pending', 'paid', 'shipped', 'cancelled', 'refunded']),
  total: z.number().positive(),
  currency: z.enum(['USD', 'EUR']),
  createdAt: z.string(), // ISO date
  country: z.string(),
  itemsCount: z.number().int().positive(),
});

export type Order = z.infer<typeof orderSchema>;

/**
 * Order item schema
 */
export const orderItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  qty: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

/**
 * Order with details (includes items)
 */
export const orderDetailSchema = orderSchema.extend({
  items: z.array(orderItemSchema),
});

export type OrderDetail = z.infer<typeof orderDetailSchema>;

/**
 * API response schemas
 */
export const ordersResponseSchema = z.object({
  data: z.array(orderSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

export const statsResponseSchema = z.object({
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

export type StatsResponse = z.infer<typeof statsResponseSchema>;
