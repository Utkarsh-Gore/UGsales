import "./Aboutus.css";
import { NavLink } from "react-router-dom";

function Aboutus() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">WELCOME TO UG SALES</span>
          <h1>Shopping Made <span>Simple.</span></h1>
          <p>
            Discover quality products, explore the latest trends, and enjoy
            a seamless shopping experience — all in one place.
          </p>
          <NavLink to="/all" className="about-btn">
            Explore Products →
          </NavLink>
        </div>

        <div className="about-hero-icon">🛍️</div>
      </section>

      {/* About Section */}
      <section className="about-intro">
        <h2>Who We Are</h2>
        <p>
          UG Sales is an online shopping platform designed to make your
          everyday shopping easier, faster, and more convenient. From
          electronics and fashion to beauty and sports products, we bring
          different categories together in one place.
        </p>
        <p>
          Our goal is to provide a user-friendly shopping experience where
          customers can explore products, manage orders, and shop with
          confidence.
        </p>
      </section>

      {/* Features */}
      <section className="about-features">
        <h2>Why Shop With Us?</h2>

        <div className="about-grid">
          <div className="about-card">
            <span>⭐</span>
            <h3>Quality Products</h3>
            <p>Explore products selected to meet your everyday needs.</p>
          </div>

          <div className="about-card">
            <span>🔒</span>
            <h3>Secure Shopping</h3>
            <p>We aim to protect your account and shopping information.</p>
          </div>

          <div className="about-card">
            <span>🚚</span>
            <h3>Easy Ordering</h3>
            <p>Browse products and manage your shopping in one place.</p>
          </div>

          <div className="about-card">
            <span>💬</span>
            <h3>Customer Support</h3>
            <p>We're here to help you with questions about your shopping.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="about-categories">
        <h2>Everything in One Place</h2>
        <div className="category-list">
          <span>📱 Electronics</span>
          <span>👕 Fashion</span>
          <span>💄 Beauty</span>
          <span>⚽ Sports</span>
          <span>📺 Home Entertainment</span>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Your Next Favorite Product Awaits!</h2>
        <p>Start exploring and find something you love.</p>
        <NavLink to="/all" className="about-btn">
          Start Shopping →
        </NavLink>
      </section>
    </div>
  );
}

export default Aboutus;