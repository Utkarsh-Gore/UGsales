import "./Feature.css";
import { NavLink } from "react-router-dom";

function Feature() {
  const options = [
    { icon: "📦", title: "Your Orders", desc: "Track, cancel, or view your orders", link: "/orders" },
    { icon: "👤", title: "Your Profile", desc: "Edit your personal information", link: "/profile" },
   
    { icon: "❤️", title: "Your Wishlist", desc: "View your saved products", link: "/wishlist" },
    { icon: "💳", title: "Payment History", desc: "Manage your payment methods", link: "/payment" },
    { icon: "🎧", title: "Help & Support", desc: "Get help with your orders", link: "/support" },
    { icon: "ℹ️", title: "About Us", desc: "Know more about our company", link: "/aboutus" },
  ];

  return (
    <div className="feature-page">
      <h1>Orders & More</h1>
      <p className="feature-subtitle">
        Manage your account and shopping activities
      </p>

      <div className="feature-grid">
        {options.map((option) => (
          <NavLink
            to={option.link}
            className="feature-card"
            key={option.title}
          >
            <span className="feature-icon">{option.icon}</span>

            <div className="feature-info">
              <h3>{option.title}</h3>
              <p>{option.desc}</p>
            </div>

            <span className="feature-arrow">›</span>
          </NavLink>
        ))}
      </div>
      <br />
         <NavLink to="/all" className="exit-link">
  <button className="exit-btn">← Exit</button>
</NavLink>
    </div>
  );
}

export default Feature;