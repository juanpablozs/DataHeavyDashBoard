import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated()) {
    return <Outlet />;
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #eee',
          padding: '1rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <h2 style={{ margin: 0, color: '#1a1a1a' }}>DataHeavy Dashboard</h2>
            </Link>

            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: 500,
                  color: isActive('/dashboard') ? '#646cff' : '#666',
                  backgroundColor: isActive('/dashboard') ? '#f0f0f0' : 'transparent',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/orders"
                style={{
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: 500,
                  color: isActive('/orders') ? '#646cff' : '#666',
                  backgroundColor: isActive('/orders') ? '#f0f0f0' : 'transparent',
                }}
              >
                Orders
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>
              {user?.name || user?.email}
            </span>
            <button onClick={handleLogout} className="secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #eee',
          padding: '1.5rem 0',
          backgroundColor: 'white',
          marginTop: 'auto',
        }}
      >
        <div className="container" style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
          <p>DataHeavy Dashboard - Production-grade React + TypeScript demo</p>
        </div>
      </footer>
    </div>
  );
}
