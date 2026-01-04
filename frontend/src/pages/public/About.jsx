import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';

const About = () => {
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
            About YourTera
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Revolutionizing queue management across Ethiopia with smart, digital solutions
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4A868C', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Our Mission
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              To eliminate long waiting lines and improve service efficiency across government offices, 
              telecom centers, and public service institutions in Ethiopia.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4A868C', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Our Vision
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              A future where every Ethiopian can access public services efficiently, 
              transparently, and without unnecessary delays through digital innovation.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4A868C', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Our Impact
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Serving over 50+ offices across Ethiopia, reducing wait times by 85%, 
              and improving customer satisfaction for thousands of users daily.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#4A868C', fontSize: '2rem', marginBottom: '1rem' }}>
            Ready to Transform Your Service?
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join hundreds of organizations already using YourTera to improve their customer experience.
          </p>
          <button style={{
            backgroundColor: '#4A868C',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Get Started Today
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;