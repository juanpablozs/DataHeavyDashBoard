export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  refundsCount: number;
  ordersByStatus: Record<string, number>;
  revenueOverTime: Array<{
    date: string;
    revenue: number;
  }>;
}
