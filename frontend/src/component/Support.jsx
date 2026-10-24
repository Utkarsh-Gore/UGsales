import "./Support.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Order Related",
    message: "",
  });

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Open Your Orders from your account to view order details and tracking information when available.",
    },
    {
      question: "How can I cancel my order?",
      answer:
        "Visit Your Orders, select the relevant order, and request cancellation if it is eligible.",
    },
    {
      question: "How do I request a return or refund?",
      answer:
        "Visit Returns & Refunds from your account and follow the instructions for your order.",
    },
    {
      question: "How can I change my delivery address?",
      answer:
        "Update your saved addresses from Your Addresses. For an existing order, contact support as soon as possible.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "Go to the login page and use the Forgot Password option if it is available.",
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect this form to your backend support API.
    console.log("Support request:", form);
    alert("Demo form submitted! Connect the backend to send your request.");

    setForm({
      name: "",
      email: "",
      topic: "Order Related",
      message: "",
    });
  };

  return (
    <div className="support-page">
      {/* Hero */}
      <section className="support-hero">
        <div>
          <span className="support-tag">UG SALES CUSTOMER CARE</span>
          <h1>How Can We Help You?</h1>
          <p>
            Need help with an order, return, payment, or your account?
            Find answers or send us a support request.
          </p>
        </div>
        <div className="support-hero-icon">🎧</div>
      </section>

      {/* Help options */}
      <section className="support-options">
        <h2>What Do You Need Help With?</h2>

        <div className="support-grid">
          <NavLink to="/orders" className="support-card">
            <span>📦</span>
            <h3>My Orders</h3>
            <p>Track and manage your orders.</p>
          </NavLink>

          <NavLink to="/returns" className="support-card">
            <span>↩️</span>
            <h3>Returns & Refunds</h3>
            <p>Get help with returns and refunds.</p>
          </NavLink>

          <NavLink to="/profile" className="support-card">
            <span>👤</span>
            <h3>My Account</h3>
            <p>Manage your account information.</p>
          </NavLink>

          <NavLink to="/payment" className="support-card">
            <span>💳</span>
            <h3>Payments</h3>
            <p>Get help with payment issues.</p>
          </NavLink>
        </div>
      </section>

      {/* FAQs */}
      <section className="support-faq">
        <h2>Frequently Asked Questions</h2>
        <p className="support-subtitle">
          Quick answers to common shopping questions.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.question}>
              <button
                className="faq-question"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                aria-expanded={openFaq === index}
              >
                <span>{faq.question}</span>
                <span>{openFaq === index ? "−" : "+"}</span>
              </button>

              {openFaq === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="support-contact">
        <div className="support-contact-info">
          <span className="support-tag">WE ARE HERE TO HELP</span>
          <h2>Contact Support</h2>
          <p>
            Tell us what happened, and our support team can help you
            resolve your issue.
          </p>

          <div className="support-contact-point">
            <span>📩</span>
            <div>
              <h3>Email Support</h3>
              <p>Connect your official support email here.</p>
            </div>
          </div>

          <div className="support-contact-point">
            <span>🕒</span>
            <div>
              <h3>Support Hours</h3>
              <p>Add your actual customer support timings here.</p>
            </div>
          </div>
        </div>

        <form className="support-form" onSubmit={handleSubmit}>
          <h3>Send Us a Message</h3>

          <label htmlFor="support-name">Full Name</label>
          <input
            id="support-name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="support-email">Email Address</label>
          <input
            id="support-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="support-topic">Issue Type</label>
          <select
            id="support-topic"
            name="topic"
            value={form.topic}
            onChange={handleChange}
          >
            <option>Order Related</option>
            <option>Payment Issue</option>
            <option>Return or Refund</option>
            <option>Account Issue</option>
            <option>Product Issue</option>
            <option>Other</option>
          </select>

          <label htmlFor="support-message">Your Message</label>
          <textarea
            id="support-message"
            name="message"
            placeholder="Describe your issue..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="support-submit">
            Submit Request →
          </button>
        </form>
      </section>

      {/* Bottom */}
      <section className="support-bottom">
        <h2>Still Need Help?</h2>
        <p>Visit your account to manage your shopping activities.</p>
        <NavLink to="/feature" className="support-back-btn">
          ← Back to Orders & More
        </NavLink>
      </section>
    </div>
  );
}

export default Support;