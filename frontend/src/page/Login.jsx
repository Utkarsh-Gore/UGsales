
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { email, password },
        { withCredentials: true }
      );

      loginUser(response.data.user);

      // Redirect admin to admin panel
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/all");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Login failed. Please check your credentials.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-logo">
          UG
        </div>

        <h1>Welcome Back!</h1>

        <p className="signup-subtitle">
          Sign in to continue shopping with UG Sales.
        </p>

        <form onSubmit={handleLogin} className="signup-form">
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => Setemail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>

          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => Setpassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="signup-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="signup-footer">
          Don't have an account?{" "}
          <NavLink to="/signup">Create Account</NavLink>
        </p>

        <p className="signup-terms">
          Securely sign in to access your UG Sales account.
        </p>
      </div>
    </div>
  );
}

export default Login;
