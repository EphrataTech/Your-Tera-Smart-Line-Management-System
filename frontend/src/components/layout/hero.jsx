import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = ["Smart Line Management System", "Digital Queue Solutions", "Efficient Service Delivery"];
  const currentText = texts[currentIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentText, texts.length]);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          {displayText}
          <span className="cursor">|</span>
        </h1>
        <p className="hero-subtitle">Reduce waiting time, Get Notified.</p>
        {!isAuthenticated && (
          <button className="hero-btn" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        )}
        {isAuthenticated && (
          <button 
            className="hero-btn" 
            onClick={() => navigate('/services')}
            style={{ backgroundColor: '#ff6b35' }}
          >
            Join Queue
          </button>
        )}
      </div>

      <div className="hero-image">
        <img src="/images/hero.png" alt="Queue illustration" />
      </div>
    </section>
  );
};

export default Hero;
