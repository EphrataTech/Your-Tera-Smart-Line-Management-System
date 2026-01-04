import { Link } from 'react-router-dom';

const Status = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#4A868C' }}>Queue Status</h1>
      <p>Please sign in to view your queue status.</p>
      <Link to="/signin" style={{ 
        backgroundColor: '#4A868C', 
        color: 'white', 
        padding: '10px 20px', 
        textDecoration: 'none',
        borderRadius: '6px'
      }}>
        Sign In
      </Link>
    </div>
  );
};

export default Status;