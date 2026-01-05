import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#4A868C',
          margin: 0,
          lineHeight: 1
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '32px',
          color: '#333',
          marginBottom: '16px'
        }}>
          Page Not Found
        </h2>
        
        <p style={{
          color: '#666',
          fontSize: '18px',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#4A868C',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.3s'
          }}
        >
          <Home size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;