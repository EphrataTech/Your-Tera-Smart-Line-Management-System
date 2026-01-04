import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || 'Operation completed successfully!';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(62, 129, 139, 1), rgba(5, 63, 71, 1))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        textAlign: 'center'
      }}>
        <CheckCircle 
          size={64} 
          color="#10b981" 
          style={{ marginBottom: '20px' }}
        />
        
        <h1 style={{ 
          color: '#4A868C', 
          fontSize: '28px', 
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          Success!
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '16px',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        <p style={{ 
          color: '#999', 
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          You will be redirected to the sign-in page in 5 seconds...
        </p>

        <Link 
          to="/signin"
          style={{
            display: 'inline-block',
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
          Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default Success;