import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from './api/getOrderById';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <LoadingSpinner size="lg" />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="error-message">
          <h3>Order not found</h3>
          <p style={{ marginTop: '0.5rem' }}>
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/orders" style={{ marginTop: '1rem', display: 'inline-block' }}>
            <button>Back to Orders</button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Link to="/orders" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        <button className="secondary">← Back to Orders</button>
      </Link>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{order.id}</h1>
            <p style={{ color: '#666' }}>Created {formatDateTime(order.createdAt)}</p>
          </div>
          <span
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'white',
              backgroundColor:
                order.status === 'paid'
                  ? '#10b981'
                  : order.status === 'shipped'
                    ? '#3b82f6'
                    : order.status === 'pending'
                      ? '#f59e0b'
                      : order.status === 'cancelled'
                        ? '#ef4444'
                        : '#6b7280',
              textTransform: 'capitalize',
            }}
          >
            {order.status}
          </span>
        </div>

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />

        {/* Customer Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Customer
            </h3>
            <p style={{ fontWeight: 500 }}>{order.customerName}</p>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>{order.customerEmail}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Shipping
            </h3>
            <p>{order.country}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Payment
            </h3>
            <p>{order.currency}</p>
          </div>
        </div>

        {/* Order Items */}
        <h2 style={{ marginBottom: '1rem' }}>Items ({order.items.length})</h2>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th style={{ textAlign: 'right' }}>Quantity</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.sku}>
                <td style={{ color: '#666', fontSize: '0.875rem' }}>{item.sku}</td>
                <td>{item.name}</td>
                <td style={{ textAlign: 'right' }}>{item.qty}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice, order.currency)}</td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>
                  {formatCurrency(item.qty * item.unitPrice, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} style={{ textAlign: 'right', fontWeight: 600, paddingTop: '1rem' }}>
                Subtotal:
              </td>
              <td style={{ textAlign: 'right', fontWeight: 600, paddingTop: '1rem' }}>
                {formatCurrency(subtotal, order.currency)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.125rem' }}>
                Total:
              </td>
              <td
                style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.125rem', color: '#10b981' }}
              >
                {formatCurrency(order.total, order.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
