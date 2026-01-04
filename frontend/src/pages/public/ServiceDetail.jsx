import { useParams, Link } from 'react-router-dom';

const ServiceDetail = () => {
  const { type } = useParams();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#4A868C' }}>Service Detail: {type}</h1>
      <p>Detailed information about {type} service would be displayed here.</p>
      <Link to="/services" style={{ color: '#4A868C' }}>← Back to Services</Link>
    </div>
  );
};

export default ServiceDetail;