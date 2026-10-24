import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastProvider } from "./AdminToast";
import "./Admin.css";

function AdminLayoutInner() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.includes("products")) return "Products";
    if (path.includes("orders")) return "Orders";
    if (path.includes("users")) return "Users";
    return "Admin Panel";
  };

  // Redirect non-admin users
  if (user?.role !== "admin") {
    return (
      <div className="admin-denied">
        <h2>⛔ Access Denied</h2>
        <p>You need admin privileges to access this panel.</p>
        <button onClick={() => navigate("/all")}>Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>UG<span>Admin</span></h2>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
          >
            <i className="fa-solid fa-gauge-high"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
          >
            <i className="fa-solid fa-box"></i>
            <span>Products</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
          >
            <i className="fa-solid fa-truck"></i>
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
          >
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <NavLink to="/all" className="admin-link">
            <i className="fa-solid fa-store"></i>
            <span>View Store</span>
          </NavLink>
          <button
            className="admin-logout-btn"
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-page-title">{getPageTitle()}</h1>
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user?.name}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminLayout() {
  return (
    <ToastProvider>
      <AdminLayoutInner />
    </ToastProvider>
  );
}

export default AdminLayout;
