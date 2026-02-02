import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './Layout';
import LoginForm from '@/features/auth/components/LoginForm';
import DashboardPage from '@/features/dashboard/DashboardPage';
import OrdersPage from '@/features/orders/OrdersPage';
import OrderDetailPage from '@/features/orders/OrderDetailPage';
import NotFoundPage from '@/components/NotFoundPage';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
