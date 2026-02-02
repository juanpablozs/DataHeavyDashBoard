export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  currency: 'USD' | 'EUR';
  createdAt: string;
  country: string;
  itemsCount: number;
}

export interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface OrdersQueryParams {
  page: number;
  pageSize: number;
  search: string;
  status: OrderStatus[];
  country: string;
  from: string;
  to: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
