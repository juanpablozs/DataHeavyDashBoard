import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export default function SummaryCard({ title, value, icon, trend, color = '#646cff' }: SummaryCardProps) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{title}</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: color }}>{value}</p>
          {trend && (
            <p
              style={{
                fontSize: '0.875rem',
                color: trend.isPositive ? '#10b981' : '#ef4444',
                marginTop: '0.5rem',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              fontSize: '2.5rem',
              opacity: 0.2,
              position: 'absolute',
              right: '1rem',
              top: '1rem',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
