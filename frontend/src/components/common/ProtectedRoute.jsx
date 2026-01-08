import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#4A868C'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (user?.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;