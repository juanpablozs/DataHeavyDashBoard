interface ChartOrdersByStatusProps {
  data: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  paid: '#10b981',
  shipped: '#3b82f6',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

export default function ChartOrdersByStatus({ data }: ChartOrdersByStatusProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem' }}>Orders by Status</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(data).map(([status, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={status}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{status}</span>
                <span style={{ color: '#666' }}>
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: STATUS_COLORS[status] || '#999',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
