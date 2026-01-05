import { Link } from 'react-router-dom';

const TestAbout = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#4A868C' }}>Test About Page</h1>
      <p>This is a test page for development purposes.</p>
      <Link to="/" style={{ color: '#4A868C' }}>← Back to Home</Link>
    </div>
  );
};

export default TestAbout;