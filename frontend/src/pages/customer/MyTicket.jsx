import { useState, useEffect } from 'react';
import { Ticket, Clock, MapPin, Building2, AlertCircle, X } from 'lucide-react';
import { queueAPI } from '../../services/api';

const MyTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingTicket, setCancellingTicket] = useState(null);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const response = await queueAPI.getMyStatus();
      // Filter out cancelled and completed tickets to show only active ones
      const activeTickets = response.data.filter(ticket => 
        ticket.status === 'Waiting' || ticket.status === 'Serving'
      );
      setTickets(activeTickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    setCancellingTicket(ticketId);
    try {
      await queueAPI.cancelTicket(ticketId);
      // Remove the cancelled ticket from the list immediately
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (err) {
      console.error('Error cancelling ticket:', err);
      setError('Failed to cancel ticket');
    } finally {
      setCancellingTicket(null);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(62, 129, 139, 1), rgba(5, 63, 71, 1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading your tickets...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(62, 129, 139, 1), rgba(5, 63, 71, 1))',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          My Tickets
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ color: '#dc2626' }}>{error}</span>
          </div>
        )}

        {tickets.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <Ticket size={64} color="#6b7280" style={{ marginBottom: '20px' }} />
            <h2 style={{ color: '#4b5563', fontSize: '24px', marginBottom: '10px' }}>
              No Tickets Found
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              You haven't joined any queues yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  border: `3px solid ${getStatusColor(ticket.status)}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      Ticket #{ticket.ticket_number}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: getStatusColor(ticket.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {ticket.status}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      textAlign: 'right',
                      color: '#6b7280',
                      fontSize: '14px'
                    }}>
                      Position: #{ticket.position}
                    </div>
                    {ticket.status === 'Waiting' && (
                      <button
                        onClick={() => handleCancelTicket(ticket._id)}
                        disabled={cancellingTicket === ticket._id}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: cancellingTicket === ticket._id ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          opacity: cancellingTicket === ticket._id ? 0.6 : 1
                        }}
                      >
                        <X size={16} />
                        {cancellingTicket === ticket._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Building2 size={20} color="#4A868C" />
                    <div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Office</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {ticket.service_id?.office_id?.office_name || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Ticket size={20} color="#4A868C" />
                    <div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Service</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {ticket.service_id?.service_name || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} color="#4A868C" />
                    <div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Location</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {ticket.service_id?.office_id?.location || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={20} color="#4A868C" />
                    <div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Created</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {formatDate(ticket.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {ticket.phone_number && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    Contact: {ticket.phone_number}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicket;