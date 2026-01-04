import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { queueAPI, officeAPI, serviceAPI } from '../../services/api';
import { Bell, Clock, Users, MapPin } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('join');
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOffices();
    fetchMyStatus();
  }, []);

  useEffect(() => {
    if (selectedOffice) {
      fetchServices();
    }
  }, [selectedOffice]);

  const fetchOffices = async () => {
    try {
      const response = await officeAPI.getOffices();
      setOffices(response.data);
    } catch (error) {
      console.error('Error fetching offices:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getServicesByOffice(selectedOffice);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchMyStatus = async () => {
    try {
      const response = await queueAPI.getMyStatus();
      setMyTickets(response.data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleJoinQueue = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      setMessage('Please select a service');
      return;
    }

    setLoading(true);
    try {
      await queueAPI.joinQueue({
        service_id: selectedService,
        phone_number: user.phone_number
      });
      setMessage('Successfully joined the queue!');
      fetchMyStatus();
      setSelectedOffice('');
      setSelectedService('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    try {
      await queueAPI.cancelTicket(ticketId);
      setMessage('Ticket cancelled successfully');
      fetchMyStatus();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to cancel ticket');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return '#f59e0b';
      case 'Serving': return '#10b981';
      case 'Completed': return '#6b7280';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: '#4A868C', fontSize: '24px', fontWeight: 'bold' }}>
              YourTera Dashboard
            </h1>
            <p style={{ color: '#666', margin: 0 }}>Welcome, {user.fullname}</p>
          </div>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab('join')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'join' ? '#4A868C' : '#666',
              borderBottom: activeTab === 'join' ? '2px solid #4A868C' : 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Join Queue
          </button>
          <button
            onClick={() => setActiveTab('status')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'status' ? '#4A868C' : '#666',
              borderBottom: activeTab === 'status' ? '2px solid #4A868C' : 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            My Tickets
          </button>
        </div>

        {message && (
          <div style={{
            backgroundColor: message.includes('Success') || message.includes('successfully') ? '#d1fae5' : '#fee2e2',
            color: message.includes('Success') || message.includes('successfully') ? '#065f46' : '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Join Queue Tab */}
        {activeTab === 'join' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>Join a Queue</h2>
            
            <form onSubmit={handleJoinQueue}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#4A868C',
                  fontWeight: '500'
                }}>
                  Select Office
                </label>
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Choose an office...</option>
                  {offices.map(office => (
                    <option key={office._id} value={office._id}>
                      {office.office_name} - {office.location}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOffice && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#4A868C',
                    fontWeight: '500'
                  }}>
                    Select Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Choose a service...</option>
                    {services.map(service => (
                      <option key={service._id} value={service._id}>
                        {service.service_name} (Avg wait: {service.avg_wait_time} min)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedService}
                style={{
                  backgroundColor: loading || !selectedService ? '#ccc' : '#4A868C',
                  color: 'white',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading || !selectedService ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Joining...' : 'Join Queue'}
              </button>
            </form>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'status' && (
          <div>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>My Tickets</h2>
            
            {myTickets.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Users size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#666', fontSize: '18px' }}>No active tickets</p>
                <p style={{ color: '#999' }}>Join a queue to see your tickets here</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myTickets.map(ticket => (
                  <div
                    key={ticket._id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      borderLeft: `4px solid ${getStatusColor(ticket.status)}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h3 style={{ color: '#4A868C', marginBottom: '0.5rem' }}>
                          Ticket #{ticket.ticket_number}
                        </h3>
                        <p style={{ color: '#666', margin: 0 }}>
                          Service: {ticket.service_id?.service_name || 'N/A'}
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                          Office: {ticket.service_id?.office_id?.office_name || 'N/A'}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: getStatusColor(ticket.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {ticket.status}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} color="#666" />
                        <span style={{ color: '#666' }}>Position: {ticket.position}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#666" />
                        <span style={{ color: '#666' }}>
                          Created: {new Date(ticket.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {ticket.status === 'Waiting' && (
                      <button
                        onClick={() => handleCancelTicket(ticket._id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancel Ticket
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;