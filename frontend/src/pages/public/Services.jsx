import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { officeAPI, serviceAPI } from '../../services/api';
import { MapPin, Clock, Users } from 'lucide-react';

const Services = () => {
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [officesRes, servicesRes] = await Promise.all([
        officeAPI.getOffices(),
        serviceAPI.getServices()
      ]);
      setOffices(officesRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = () => {
    navigate('/signup');
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <p style={{ color: '#4A868C', fontSize: '18px' }}>Loading services...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            color: '#4A868C', 
            fontSize: '3rem', 
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Our Services
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Choose from our available offices and services to join the digital queue
          </p>
        </div>

        {offices.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#666', fontSize: '18px' }}>
              No services available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {offices.map(office => {
              const officeServices = services.filter(service => 
                service.office_id?._id === office._id || service.office_id === office._id
              );
              
              return (
                <div
                  key={office._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ 
                      color: '#4A868C', 
                      fontSize: '1.8rem', 
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      {office.office_name}
                    </h2>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: '#666'
                    }}>
                      <MapPin size={16} />
                      <span>{office.location}</span>
                    </div>
                  </div>

                  {officeServices.length === 0 ? (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>
                      No services available for this office
                    </p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1rem'
                    }}>
                      {officeServices.map(service => (
                        <div
                          key={service._id}
                          style={{
                            backgroundColor: '#f8f9fa',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <h3 style={{ 
                            color: '#4A868C', 
                            fontSize: '1.2rem',
                            marginBottom: '1rem'
                          }}>
                            {service.service_name}
                          </h3>
                          
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem',
                            marginBottom: '1rem',
                            color: '#666'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Clock size={16} />
                              <span>~{service.avg_wait_time} min wait</span>
                            </div>
                            <div style={{
                              backgroundColor: service.is_active ? '#10b981' : '#ef4444',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>

                          {service.required_documents && (
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{ color: '#4A868C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Required Documents:</h4>
                              <ul style={{ margin: 0, paddingLeft: '1rem', color: '#666', fontSize: '0.85rem' }}>
                                {Array.isArray(service.required_documents) 
                                  ? service.required_documents.map((doc, index) => (
                                      <li key={index} style={{ marginBottom: '0.25rem' }}>{doc}</li>
                                    ))
                                  : <li>{service.required_documents}</li>
                                }
                              </ul>
                            </div>
                          )}

                          <button
                            onClick={handleJoinQueue}
                            disabled={!service.is_active}
                            style={{
                              backgroundColor: service.is_active ? '#4A868C' : '#ccc',
                              color: 'white',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: service.is_active ? 'pointer' : 'not-allowed',
                              fontWeight: '600',
                              width: '100%'
                            }}
                          >
                            {service.is_active ? 'Join Queue' : 'Service Unavailable'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{
          backgroundColor: '#4A868C',
          color: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Ready to Skip the Line?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Create an account to join digital queues and get real-time updates
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              backgroundColor: 'white',
              color: '#4A868C',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Get Started Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;