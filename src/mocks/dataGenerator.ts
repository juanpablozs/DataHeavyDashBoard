import type { Order, OrderDetail, OrderItem } from './db';

/**
 * Seeded random number generator for deterministic data
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Elizabeth',
  'David',
  'Barbara',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Charles',
  'Karen',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
];

const countries = [
  'USA',
  'Canada',
  'UK',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Australia',
  'Japan',
  'Brazil',
  'Mexico',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
];

const statuses: Order['status'][] = ['pending', 'paid', 'shipped', 'cancelled', 'refunded'];

const products = [
  { name: 'Wireless Mouse', basePrice: 29.99 },
  { name: 'Mechanical Keyboard', basePrice: 89.99 },
  { name: 'USB-C Cable', basePrice: 12.99 },
  { name: 'Laptop Stand', basePrice: 45.0 },
  { name: 'Webcam HD', basePrice: 79.99 },
  { name: 'Desk Lamp', basePrice: 34.99 },
  { name: 'Monitor 27"', basePrice: 299.99 },
  { name: 'Office Chair', basePrice: 199.99 },
  { name: 'Desk Mat', basePrice: 24.99 },
  { name: 'Headphones', basePrice: 149.99 },
  { name: 'USB Hub', basePrice: 39.99 },
  { name: 'External SSD', basePrice: 119.99 },
  { name: 'Microphone', basePrice: 89.99 },
  { name: 'Tablet Stand', basePrice: 29.99 },
  { name: 'Cable Organizer', basePrice: 14.99 },
];

/**
 * Generate a large dataset of orders
 */
export function generateOrders(count: number = 10000): Order[] {
  const orders: Order[] = [];
  const rng = new SeededRandom(42); // Fixed seed for reproducibility
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const firstName = rng.choice(firstNames);
    const lastName = rng.choice(lastNames);
    const timestamp = ninetyDaysAgo + rng.next() * (now - ninetyDaysAgo);
    const itemsCount = rng.nextInt(1, 5);
    const currency = rng.next() > 0.7 ? 'EUR' : 'USD';

    // Generate total based on items
    const total = itemsCount * rng.nextInt(20, 200);

    orders.push({
      id: `ORD-${String(i + 1).padStart(6, '0')}`,
      customerName: `${firstName} ${lastName}`,
      customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      status: rng.choice(statuses),
      total,
      currency,
      createdAt: new Date(timestamp).toISOString(),
      country: rng.choice(countries),
      itemsCount,
    });
  }

  // Sort by date descending (newest first)
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Generate order items for a specific order
 */
export function generateOrderItems(orderId: string, itemsCount: number): OrderItem[] {
  const rng = new SeededRandom(orderId.charCodeAt(orderId.length - 1));
  const items: OrderItem[] = [];
  const selectedProducts = new Set<number>();

  for (let i = 0; i < itemsCount; i++) {
    // Ensure unique products
    let productIndex: number;
    do {
      productIndex = rng.nextInt(0, products.length - 1);
    } while (selectedProducts.has(productIndex));

    selectedProducts.add(productIndex);

    const product = products[productIndex];
    const qty = rng.nextInt(1, 3);
    const unitPrice = product.basePrice * (0.9 + rng.next() * 0.2); // ±10% variance

    items.push({
      sku: `SKU-${productIndex + 1}-${String(i).padStart(3, '0')}`,
      name: product.name,
      qty,
      unitPrice: Math.round(unitPrice * 100) / 100,
    });
  }

  return items;
}

/**
 * Get order with items
 */
export function getOrderWithItems(orders: Order[], orderId: string): OrderDetail | null {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  return {
    ...order,
    items: generateOrderItems(orderId, order.itemsCount),
  };
}

// Generate orders once and export
export const mockOrders = generateOrders(15000);
