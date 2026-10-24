
import "./Nav.css";
import imgage1 from "../assets/logo1.png";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useContext, useEffect } from "react";
import { data } from "../context/UserContext.jsx";

function Nav() {
  const navigate = useNavigate();
  const { isLoggedIn, logoutUser, user } = useAuth();
  const { allProducts, Setitem, cart } = useContext(data);
  const [value, Setvalue] = useState("");

  //logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        { withCredentials: true }
      );
      logoutUser();
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data || error.message
      );
    }
  };

  const filterProducts = (searchValue) => {
    if (!searchValue.trim()) {
      Setitem(allProducts);
      return;
    }
    const result = allProducts.filter(
      (i) =>
        i.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        i.category.toLowerCase().includes(searchValue.toLowerCase())
    );
    Setitem(result);
  };

  const handlesearch = (e) => {
    e.preventDefault();
    filterProducts(value);
  };

  useEffect(() => {
    filterProducts(value);
  }, [value, allProducts]);

  return (
    <div className="nav-container">
      <div className="box1">
        <NavLink to={isLoggedIn ? "/all" : "/login"}>
          <img src={imgage1} alt="logo" height="90" width="90" />
        </NavLink>
      </div>

      <form className="search-form" onSubmit={handlesearch}>
        <div className="box2">
          <i className="fa-solid fa-magnifying-glass" id="i1"></i>
          <input
            type="text"
            id="inp1"
            placeholder="Search products, categories…"
            value={value}
            onChange={(e) => Setvalue(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>
      </form>

      <NavLink to="/cart" className="box3">
        <i className="fa-solid fa-cart-shopping"></i>
        <span>{cart.length}</span>
      </NavLink>

      <div className="box5">
        <NavLink to={"/feature"}>Orders & More</NavLink>
      </div>

      {user?.role === "admin" && (
        <div className="box5">
          <NavLink to="/admin" className="admin-link">
            <i className="fa-solid fa-gauge-high"></i> Admin
          </NavLink>
        </div>
      )}

      <div className="box4">
        {isLoggedIn ? (
          <button
            type="button"
            className="list"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="list">
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Nav;
