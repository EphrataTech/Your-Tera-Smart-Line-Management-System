import { useNavigate } from "react-router-dom";
import { Clock, Smartphone, Users, CheckCircle, ArrowRight } from "lucide-react";

const ServicesHeader = () => {
  const navigate = useNavigate();

  const handleTryNow = () => {
    navigate('/services');
  };

  return (
    <section className="services-header">
      <div className="services-container">
        <div className="services-intro">
          <h2 className="services-title">Why Choose YourTera?</h2>
          <p className="services-subtitle">
            Experience the future of queue management with our intelligent platform designed 
            to eliminate waiting frustrations and optimize service delivery.
          </p>
        </div>
        
        <div className="services-grid">
          <div className="service-feature">
            <div className="feature-icon">
              <Clock size={32} />
            </div>
            <h3>Zero Wait Time</h3>
            <p>Join queues remotely and get notified when it's your turn. No more standing in long lines.</p>
          </div>
          
          <div className="service-feature">
            <div className="feature-icon">
              <Smartphone size={32} />
            </div>
            <h3>Mobile First</h3>
            <p>Access all features from your smartphone with our intuitive interface and QR code system.</p>
          </div>
          
          <div className="service-feature">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3>Multi-Office Support</h3>
            <p>Seamlessly manage queues across multiple locations with centralized administration.</p>
          </div>
        </div>
        
        <div className="services-benefits">
          <div className="benefits-content">
            <h3>Transform Your Service Experience</h3>
            <div className="benefits-list">
              <div className="benefit-item">
                <CheckCircle size={20} />
                <span>Real-time queue position tracking</span>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <span>Instant SMS and push notifications</span>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <span>Digital ticket with QR code verification</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="services-cta">
          <button className="services-btn primary" onClick={handleTryNow}>
            Explore Our Services
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesHeader;
