import { useContext } from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { data } from "../context/UserContext";

function Card({ item }) {
  const navigate = useNavigate();
  const { cart, setCart, wishlist, setWishlist } = useContext(data);

  const isInCart = cart.some((p) => p._id === item._id);
  const isLiked = wishlist.includes(item._id);

  const addToCart = (e) => {
    e.stopPropagation();
    if (!isInCart) {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setWishlist((prev) => prev.filter((id) => id !== item._id));
    } else {
      setWishlist((prev) => [...prev, item._id]);
    }
  };

  return (
    <div
      className="card-container"
      onClick={() => navigate(`/detail/${item._id}`)}
    >
      <div className="image-container">
        <img src={item.image} alt={item.name} className="product-img" />

        <span className="discount">
          {Math.floor(Math.random() * 40 + 10)}% OFF
        </span>

        <button
          className={`heart-btn ${isLiked ? "liked" : ""}`}
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
        >
          {isLiked ? "♥" : "♡"}
        </button>
      </div>

      <div className="product-details">
        <p className="category">{item.category}</p>
        <h3>{item.name}</h3>

        <div className="rating">
          ⭐ {item.rating}
          <span>({item.numReviews || Math.floor(Math.random() * 100)} reviews)</span>
        </div>

        <div className="price-row">
          <span className="price">₹ {item.price.toLocaleString("en-IN")}</span>
        </div>

        <button
          className={`cart-btn ${isInCart ? "in-cart" : ""}`}
          onClick={addToCart}
          disabled={isInCart}
        >
          {isInCart ? "✓ In Cart" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default Card;