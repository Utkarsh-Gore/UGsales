import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon">
          <div className="checkmark-circle">
            <svg viewBox="0 0 52 52" className="checkmark-svg">
              <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle-bg" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-path" />
            </svg>
          </div>
        </div>

        <h1>Order Placed Successfully! 🎉</h1>
        <p className="success-msg">
          Thank you for shopping with UG Sales. Your order has been confirmed and
          will be shipped soon.
        </p>

        <div className="success-info">
          <div className="info-item">
            <i className="fa-solid fa-truck-fast"></i>
            <div>
              <h4>Estimated Delivery</h4>
              <p>3-7 Business Days</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fa-solid fa-bell"></i>
            <div>
              <h4>Order Updates</h4>
              <p>Track your order in real-time</p>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button className="view-orders-btn" onClick={() => navigate("/orders")}>
            📦 View My Orders
          </button>
          <button className="continue-btn" onClick={() => navigate("/all")}>
            Continue Shopping →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
