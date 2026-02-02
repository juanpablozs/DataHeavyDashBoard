import { useMemo } from 'react';

interface ChartRevenueOverTimeProps {
  data: Array<{ date: string; revenue: number }>;
}

export default function ChartRevenueOverTime({ data }: ChartRevenueOverTimeProps) {
  const { maxRevenue, points } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.revenue), 1);
    const chartHeight = 200;
    const chartWidth = 600;
    const xStep = chartWidth / (data.length - 1 || 1);

    const pts = data.map((item, index) => {
      const x = index * xStep;
      const y = chartHeight - (item.revenue / max) * chartHeight;
      return { x, y, ...item };
    });

    return { maxRevenue: max, points: pts };
  }, [data]);

  // Create path for line chart
  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  }, [points]);

  // Create path for area under the line
  const areaData = useMemo(() => {
    if (points.length === 0) return '';
    const start = `M 0,200`;
    const line = points.map((p) => `L ${p.x},${p.y}`).join(' ');
    const end = `L ${points[points.length - 1].x},200 Z`;
    return `${start} ${line} ${end}`;
  }, [points]);

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem' }}>Revenue Over Time (Last 30 Days)</h3>

      <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
        <svg
          viewBox="0 0 600 200"
          style={{ width: '100%', height: 'auto' }}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1="0" y1="50" x2="600" y2="50" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="100" x2="600" y2="100" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="150" x2="600" y2="150" stroke="#f0f0f0" strokeWidth="1" />

          {/* Area */}
          <path d={areaData} fill="#646cff" fillOpacity="0.1" />

          {/* Line */}
          <path d={pathData} fill="none" stroke="#646cff" strokeWidth="2" />

          {/* Points */}
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="3" fill="#646cff">
              <title>
                {point.date}: ${point.revenue.toFixed(2)}
              </title>
            </circle>
          ))}
        </svg>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#666',
          }}
        >
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}
