import { describe, it, expect } from 'vitest';
import { generateOrders, generateOrderItems } from '@/mocks/dataGenerator';

describe('dataGenerator', () => {
  describe('generateOrders', () => {
    it('should generate the specified number of orders', () => {
      const orders = generateOrders(100);
      expect(orders).toHaveLength(100);
    });

    it('should generate orders with valid structure', () => {
      const orders = generateOrders(10);
      const order = orders[0];

      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('customerName');
      expect(order).toHaveProperty('customerEmail');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('currency');
      expect(order).toHaveProperty('createdAt');
      expect(order).toHaveProperty('country');
      expect(order).toHaveProperty('itemsCount');

      expect(order.total).toBeGreaterThan(0);
      expect(['USD', 'EUR']).toContain(order.currency);
      expect(['pending', 'paid', 'shipped', 'cancelled', 'refunded']).toContain(order.status);
    });

    it('should be deterministic with same seed', () => {
      const orders1 = generateOrders(10);
      const orders2 = generateOrders(10);

      expect(orders1[0].id).toBe(orders2[0].id);
      expect(orders1[0].customerName).toBe(orders2[0].customerName);
    });
  });

  describe('generateOrderItems', () => {
    it('should generate the specified number of items', () => {
      const items = generateOrderItems('ORD-000001', 3);
      expect(items).toHaveLength(3);
    });

    it('should generate items with valid structure', () => {
      const items = generateOrderItems('ORD-000001', 2);
      const item = items[0];

      expect(item).toHaveProperty('sku');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('qty');
      expect(item).toHaveProperty('unitPrice');

      expect(item.qty).toBeGreaterThan(0);
      expect(item.unitPrice).toBeGreaterThan(0);
    });
  });
});
