import { z } from 'zod';

export const orderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  status: z.enum(['pending', 'paid', 'shipped', 'cancelled', 'refunded']),
  total: z.number().positive(),
  currency: z.enum(['USD', 'EUR']),
  createdAt: z.string(),
  country: z.string(),
  itemsCount: z.number().int().positive(),
});

export const orderItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  qty: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const orderDetailSchema = orderSchema.extend({
  items: z.array(orderItemSchema),
});

export const ordersResponseSchema = z.object({
  data: z.array(orderSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
