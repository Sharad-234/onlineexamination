/**
 * Home.jsx
 * 
 * Landing page with a hero section and feature cards.
 * Provides a clear call-to-action to start the registration process.
 */

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Online Examination Registration</h1>
        <p className="hero-subtitle">
          Register for your entrance examinations online. Fill the form, upload
          your documents, and receive your application instantly.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Start Registration
        </Link>
      </section>

      <div className="container">
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Easy Registration</h3>
            <p>Fill a simple form with your personal and academic details.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Fee Information</h3>
            <p>Check examination fees and follow the institution's payment instructions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Instant PDF</h3>
            <p>Download your application PDF immediately after submission.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
