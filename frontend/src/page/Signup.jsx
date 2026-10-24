
import { NavLink, useNavigate } from "react-router-dom";
import "./Signup.css";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

function Signup() {
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/signup",
        { name, email, password },
        { withCredentials: true }
      );

      loginUser(response.data.user);
      navigate("/all");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-logo">
          <span>UG</span>
        </div>

        <h1>Create Account</h1>
        <p className="signup-subtitle">
          Join UG Sales and discover your next favorite product.
        </p>

        <form onSubmit={handleSignup} className="signup-form">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => Setname(e.target.value)}
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
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
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => Setpassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
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

          {error && <p className="signup-error">{String(error)}</p>}

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <NavLink to="/login">Login</NavLink>
        </p>

        <p className="signup-terms">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Signup;
