import { useState } from "react"

const clients = [
  {
    id: 1,
    role: "Government Service Officer",
    location: "Addis Ababa, Ethiopia",
  },
  {
    id: 2,
    role: "Telecom Customer Support Agent",
    location: "Hawassa, Ethiopia",
  },
  {
    id: 3,
    role: "AAU Student",
    location: "Addis Ababa, Ethiopia",
  },
]

const testimonials = [
  {
    id: 1,
    text: "Before using this system, our queues were chaotic. Now everything is organized, digital, and transparent",
    author: "Henok T.",
    role: "Revenue Officer",
    avatar: "/professional-ethiopian-man.jpg",
  },
  {
    id: 2,
    text: "The digital transformation has been incredible. Our customers are happier and wait times have decreased by 60%",
    author: "Sarah M.",
    role: "Service Manager",
    avatar: "/professional-ethiopian-woman.jpg",
  },
  {
    id: 3,
    text: "As a student, this system makes accessing university services so much easier. No more standing in long lines!",
    author: "Daniel K.",
    role: "Computer Science Student",
    avatar: "/young-ethiopian-student.jpg",
  },
]

export function Testimonials() {
  const [activeClient, setActiveClient] = useState(0)

  return (
    <section className="testimonials">
      <div className="testimonials-wrapper">
        <div className="testimonials-top-line"></div>
        <div className="testimonials-container">
          <h2 className="testimonials-title">Hear From Our Happy Clients</h2>
          
          <div className="testimonials-content">
            {/* Left side - Client profiles */}
            <div className="testimonials-tabs">
              {clients.map((client, index) => (
                <div key={client.id}>
                  <button
                    onClick={() => setActiveClient(index)}
                    className={`testimonial-tab ${index === activeClient ? 'active' : ''}`}
                  >
                    <div className="tab-title">{client.role}</div>
                    <div className="tab-location">{client.location}</div>
                  </button>
                  {index < clients.length - 1 && <div className="tab-divider"></div>}
                </div>
              ))}
            </div>

            {/* Right side - Testimonial */}
            <div className="testimonial-display">
              <div className="testimonial-quote">
                <blockquote className="quote-text">
                  "{testimonials[activeClient].text}"
                </blockquote>

                <div className="quote-author">
                  <div className="author-avatar">
                    <img
                      src={testimonials[activeClient].avatar || "/placeholder.svg"}
                      alt={testimonials[activeClient].author}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      style={{
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#4A868C',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {testimonials[activeClient].author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div>
                    <div className="author-name">{testimonials[activeClient].author}</div>
                    <div style={{ fontSize: '0.9rem', color: '#4A868C', opacity: 0.8 }}>
                      {testimonials[activeClient].role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
