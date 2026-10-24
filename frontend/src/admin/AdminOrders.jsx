import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./AdminToast";
import "./Admin.css";

const API = "http://localhost:8080/api";

const statusOptions = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const params = filterStatus !== "All" ? `?status=${filterStatus}` : "";
      const { data } = await axios.get(`${API}/admin/orders${params}`, {
        withCredentials: true,
      });
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Fetch Failed", "Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(
        `${API}/admin/orders/${orderId}/status`,
        { status: newStatus, note: `Status updated to ${newStatus} by admin` },
        { withCredentials: true }
      );
      toast.success("Status Updated", `Order marked as "${newStatus}"`);

      // If we have the detail modal open for this order, update it
      if (selectedOrder && selectedOrder._id === orderId) {
        const { data } = await axios.get(`${API}/orders/${orderId}`, {
          withCredentials: true,
        });
        setSelectedOrder(data.order);
      }

      fetchOrders();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update Failed", "Could not update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter by search
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(term) ||
      order.user?.name?.toLowerCase().includes(term) ||
      order.user?.email?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-table-header">
        <h2>🚚 Orders ({filteredOrders.length})</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="admin-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-filter-bar">
            <select
              className="admin-select"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setLoading(true);
              }}
            >
              <option>All</option>
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-table-card">
          <div className="admin-empty-state">
            <i className="fa-solid fa-receipt"></i>
            <p>No orders found</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "0.85rem" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                        {order.user?.name || "N/A"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--admin-text-dim)" }}>
                        {order.user?.email || ""}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "1px solid var(--admin-border)",
                            }}
                          />
                          <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                            {item.name.length > 16 ? item.name.slice(0, 16) + "…" : item.name} ×{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--admin-text-dim)" }}>
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 8,
                        background:
                          order.paymentInfo?.status === "paid"
                            ? "rgba(0, 212, 170, 0.1)"
                            : order.paymentInfo?.status === "refunded"
                            ? "rgba(84, 160, 255, 0.1)"
                            : "rgba(255, 107, 107, 0.1)",
                        color:
                          order.paymentInfo?.status === "paid"
                            ? "var(--admin-success)"
                            : order.paymentInfo?.status === "refunded"
                            ? "var(--admin-info)"
                            : "var(--admin-danger)",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {order.paymentInfo?.status || "PENDING"}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status.replace(/\s/g, "-")}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {order.status !== "Delivered" && order.status !== "Cancelled" ? (
                        <select
                          className="admin-select"
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          style={{ fontSize: "0.78rem", padding: "6px 30px 6px 10px", minWidth: 120 }}
                        >
                          {statusOptions.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--admin-text-dim)", padding: "6px 0" }}>
                          Final
                        </span>
                      )}
                      <button
                        className="admin-action-btn view"
                        onClick={() => setSelectedOrder(order)}
                        style={{ marginRight: 0 }}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-detail-header">
              <div>
                <h2 style={{ marginBottom: 6 }}>Order Details</h2>
                <div className="order-detail-id">
                  ID: #{selectedOrder._id.slice(-8).toUpperCase()} &nbsp;•&nbsp;
                  <span className={`status-badge status-${selectedOrder.status.replace(/\s/g, "-")}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <button className="order-detail-close" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>

            <div className="order-detail-grid">
              {/* Customer */}
              <div className="order-detail-section">
                <h4>Customer</h4>
                <p>
                  <strong>{selectedOrder.user?.name || "N/A"}</strong>
                  <br />
                  <span style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
                    {selectedOrder.user?.email || ""}
                  </span>
                </p>
              </div>

              {/* Payment */}
              <div className="order-detail-section">
                <h4>Payment</h4>
                <p>
                  <strong>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</strong>
                  <br />
                  <span style={{
                    fontSize: "0.82rem",
                    color: selectedOrder.paymentInfo?.status === "paid" ? "var(--admin-success)" : "var(--admin-warning)",
                  }}>
                    {selectedOrder.paymentInfo?.status?.toUpperCase() || "PENDING"} •{" "}
                    {selectedOrder.paymentInfo?.method || "razorpay"}
                  </span>
                </p>
              </div>

              {/* Shipping Address */}
              <div className="order-detail-section full-width">
                <h4>Shipping Address</h4>
                {selectedOrder.shippingAddress ? (
                  <p>
                    {selectedOrder.shippingAddress.name} &nbsp;•&nbsp;{" "}
                    {selectedOrder.shippingAddress.phone}
                    <br />
                    {selectedOrder.shippingAddress.street},{" "}
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} —{" "}
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                ) : (
                  <p style={{ color: "var(--admin-text-dim)" }}>No address info</p>
                )}
              </div>

              {/* Items */}
              <div className="order-detail-section full-width">
                <h4>Items ({selectedOrder.items.length})</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div className="order-item-row" key={idx}>
                    <img src={item.image} alt={item.name} />
                    <div className="order-item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="order-item-price">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="order-detail-section full-width">
                  <h4>Status Timeline</h4>
                  <div className="status-timeline">
                    {selectedOrder.statusHistory.map((entry, idx) => (
                      <div className="timeline-item" key={idx}>
                        <div className="timeline-status">{entry.status}</div>
                        <div className="timeline-date">
                          {new Date(entry.date).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {entry.note && <div className="timeline-note">{entry.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Update Status from Detail Modal */}
            {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && (
              <div className="order-update-section">
                <label>Update Status:</label>
                <select
                  className="admin-select"
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  disabled={updatingId === selectedOrder._id}
                >
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {updatingId === selectedOrder._id && (
                  <div className="spinner" style={{ width: 20, height: 20, margin: 0, borderWidth: 2 }}></div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
