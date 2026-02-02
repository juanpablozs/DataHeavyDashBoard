import { useQuery } from '@tanstack/react-query';
import { getStats } from './api/getStats';
import SummaryCard from './components/SummaryCard';
import ChartOrdersByStatus from './components/ChartOrdersByStatus';
import ChartRevenueOverTime from './components/ChartRevenueOverTime';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });

  if (isLoading) {
    return (
      <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <LoadingSpinner size="lg" />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="error-message">
          <h3>Failed to load dashboard</h3>
          <p style={{ marginTop: '0.5rem' }}>{(error as Error)?.message || 'Unknown error'}</p>
          <button onClick={() => refetch()} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <SummaryCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon="📦"
          color="#3b82f6"
        />
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue, 'USD')}
          icon="💰"
          color="#10b981"
        />
        <SummaryCard
          title="Orders Today"
          value={stats.ordersToday}
          icon="📈"
          color="#f59e0b"
        />
        <SummaryCard
          title="Refunds"
          value={stats.refundsCount}
          icon="↩️"
          color="#ef4444"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <ChartOrdersByStatus data={stats.ordersByStatus} />
        <ChartRevenueOverTime data={stats.revenueOverTime} />
      </div>
    </div>
  );
}
