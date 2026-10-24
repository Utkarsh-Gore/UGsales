import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const API = "http://localhost:8080/api";

const statusColors = {
  Placed: "#667eea",
  Confirmed: "#6c5ce7",
  Shipped: "#0984e3",
  "Out for Delivery": "#fdcb6e",
  Delivered: "#00b894",
  Cancelled: "#d63031",
};

const statusSteps = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, {
        withCredentials: true,
      });
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>When you place orders, they will appear here.</p>
          <button onClick={() => navigate("/all")} className="shop-btn">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <p className="orders-subtitle">{orders.length} order{orders.length > 1 ? "s" : ""} placed</p>

      <div className="orders-list">
        {orders.map((order) => {
          const currentStep = statusSteps.indexOf(order.status);
          const isCancelled = order.status === "Cancelled";

          return (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className="order-status-badge"
                  style={{ background: statusColors[order.status] || "#888" }}
                >
                  {order.status}
                </span>
              </div>

              {/* Status Timeline */}
              {!isCancelled && (
                <div className="status-timeline">
                  {statusSteps.map((step, index) => (
                    <div
                      className={`timeline-step ${index <= currentStep ? "active" : ""}`}
                      key={step}
                    >
                      <div className="timeline-dot"></div>
                      {index < statusSteps.length - 1 && (
                        <div className={`timeline-line ${index < currentStep ? "active" : ""}`}></div>
                      )}
                      <span className="timeline-label">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {isCancelled && (
                <div className="cancelled-banner">
                  <i className="fa-solid fa-ban"></i>
                  <span>This order has been cancelled</span>
                </div>
              )}

              <div className="order-items-preview">
                {order.items.map((item, idx) => (
                  <div className="order-item-row" key={idx}>
                    <img src={item.image} alt={item.name} />
                    <div className="order-item-detail">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <span className="order-item-price">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-address">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>
                    {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </span>
                </div>
                <div className="order-total">
                  Total: <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
