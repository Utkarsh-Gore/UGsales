import { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const API = "http://localhost:8080/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/dashboard`, {
        withCredentials: true,
      });
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div className="stat-info">
            <h3>₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fa-solid fa-box"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teal">
            <i className="fa-solid fa-truck"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.deliveredOrders || 0}</h3>
            <p>Delivered</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.pendingOrders || 0}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <i className="fa-solid fa-ban"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.cancelledOrders || 0}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
        <div className="admin-table-card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>
            Order Status Breakdown
          </h2>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {stats.ordersByStatus.map((s) => (
              <div
                key={s._id}
                style={{
                  padding: "16px 24px",
                  background: "var(--admin-surface-2)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: 14,
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--admin-text)" }}>
                  {s.count}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {s._id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Revenue Chart */}
      {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
        <div className="admin-table-card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>
            Monthly Revenue (Last 6 Months)
          </h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180, padding: "0 8px" }}>
            {(() => {
              const maxRev = Math.max(...stats.monthlyRevenue.map((m) => m.revenue));
              const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return stats.monthlyRevenue.map((m, idx) => {
                const height = maxRev > 0 ? (m.revenue / maxRev) * 140 : 10;
                return (
                  <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--admin-text-muted)" }}>
                      ₹{(m.revenue / 1000).toFixed(1)}k
                    </span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 48,
                        height: Math.max(height, 8),
                        background: "linear-gradient(180deg, #667eea, #764ba2)",
                        borderRadius: 8,
                        transition: "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                    <span style={{ fontSize: "0.72rem", color: "var(--admin-text-dim)", fontWeight: 500 }}>
                      {months[m._id.month]}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="admin-table-card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>
          Recent Orders
        </h2>
        {stats?.recentOrders?.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "0.85rem" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>{order.user?.name || "N/A"}</td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status.replace(/\s/g, "-")}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <i className="fa-solid fa-receipt"></i>
            <p>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
