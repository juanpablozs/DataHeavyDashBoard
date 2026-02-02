import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '4rem', color: '#999', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
