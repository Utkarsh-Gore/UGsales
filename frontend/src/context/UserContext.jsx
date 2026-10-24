
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const data = createContext();

const API = "http://localhost:8080/api";

function UserContext({ children }) {
  const [item, Setitem] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products`);
      setAllProducts(res.data.products);
      Setitem(res.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <data.Provider
      value={{
        item,
        Setitem,
        allProducts,
        setAllProducts,
        cart,
        setCart,
        wishlist,
        setWishlist,
        category,
        setCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        loading,
        fetchProducts,
      }}
    >
      {children}
    </data.Provider>
  );
}

export default UserContext;
