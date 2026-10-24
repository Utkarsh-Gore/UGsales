import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./AdminToast";
import "./Admin.css";

const API = "http://localhost:8080/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/users`, {
        withCredentials: true,
      });
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Fetch Failed", "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-table-header">
        <h2>👥 Users ({filteredUsers.length})</h2>
        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="admin-table-card">
          <div className="admin-empty-state">
            <i className="fa-solid fa-user-slash"></i>
            <p>{searchTerm ? "No users match your search" : "No users found"}</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Addresses</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background:
                          user.role === "admin"
                            ? "linear-gradient(135deg, #667eea, #764ba2)"
                            : "linear-gradient(135deg, #00d4aa, #00cec9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        boxShadow:
                          user.role === "admin"
                            ? "0 2px 8px rgba(102, 126, 234, 0.3)"
                            : "0 2px 8px rgba(0, 212, 170, 0.2)",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{user.name}</td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: "0.88rem" }}>
                    {user.email}
                  </td>
                  <td style={{ color: "var(--admin-text-muted)" }}>
                    {user.phone || (
                      <span style={{ color: "var(--admin-text-dim)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: user.addresses?.length > 0 ? "var(--admin-text)" : "var(--admin-text-dim)",
                    }}>
                      {user.addresses?.length || 0}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
