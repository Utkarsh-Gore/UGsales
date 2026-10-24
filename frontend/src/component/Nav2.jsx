import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { data } from "../context/UserContext";
import "./Nav2.css";

function Nav2() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  
  const {
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    allProducts,
    Setitem,
  } = useContext(data);


// filter code:   
const applyFilter = () => {
    const filteredProducts = allProducts.filter((product) => {
      const matchCategory =
        category === "All" ||
        product.category.toLowerCase() === category.toLowerCase();

      const matchPrice =
        Number(product.price) >= minPrice &&
        Number(product.price) <= maxPrice;

      return matchCategory && matchPrice;
    });

    Setitem(filteredProducts);
  };

    const resetFilter = () => {
    setCategory("All");
    setMinPrice(0);
    setMaxPrice(100000);
    Setitem(allProducts);
  };

  const handleApply = () => {
    if (minPrice > maxPrice) {
      alert("Minimum price cannot exceed maximum price");
      return;
    }
    applyFilter();
    closeMenu();
  };

  return (
    <>
      <div className="nav2-container">
        <button
          className="category-icon ham"
          onClick={() => setIsOpen(true)}
          aria-label="Open filter"
        >
          <i className="fa-solid fa-sliders"></i>
        </button>

        <NavLink to="/all" className="category-icon">
          <i className="fa-solid fa-check"></i>
        </NavLink>

        <NavLink to="/mobile" className="category-icon">
          <i className="fa-solid fa-mobile-screen-button"></i>
        </NavLink>

        <NavLink to="/cloth" className="category-icon">
          <i className="fa-solid fa-shirt"></i>
        </NavLink>

        <NavLink to="/tv" className="category-icon">
          <i className="fa-solid fa-tv"></i>
        </NavLink>

        <NavLink to="/beauty" className="category-icon">
          <i className="fa-solid fa-spa"></i>
        </NavLink>

        <NavLink to="/sport" className="category-icon">
          <i className="fa-solid fa-futbol"></i>
        </NavLink>

        <NavLink to="/electronics" className="category-icon">
          <i className="fa-solid fa-plug"></i>
        </NavLink>
      </div>

      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>
            UG Sales<span>.</span>
          </h2>

          <button onClick={closeMenu} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <h3 className="sidebar-title">Apply Filter</h3>

        <div className="filter-section">
          <h4>Category</h4>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Smartphone">Smartphones</option>
            <option value="TV">TV</option>
            <option value="Clothing">Clothing</option>
            <option value="Beauty">Beauty</option>
            <option value="Sports">Sports</option>
            <option value="Electronics">Electronics</option>
          </select>

          <h4>Minimum Price: ₹{minPrice}</h4>

          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />

          <h4>Maximum Price: ₹{maxPrice}</h4>

          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />

          <button className="btn1" onClick={handleApply}>
            Apply Filter
          </button>

          <button
            className="btn1 reset-btn"
            onClick={() => {
              resetFilter();
              closeMenu();
            }}
          >
            Reset Filter
          </button>
        </div>

        <div className="sidebar-bottom">
          <i className="fa-solid fa-headset"></i>
          <div>
            <h4>Need Help?</h4>
            <p>Contact our support team.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav2;