import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { data } from "../context/UserContext";
import "./Detail.css";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    allProducts,
    wishlist,
    setWishlist,
    cart,
    setCart,
  } = useContext(data);

  const product = allProducts.find(
    (p) => String(p._id) === id
  );

  if (!product) {
    return (
      <div className="detail-not-found">
        <h2>Product not found!</h2>
        <button onClick={() => navigate("/all")}>
          Back to Home
        </button>
      </div>
    );
  }

  const isLiked = wishlist.includes(product._id);

  const isInCart = (cart || []).some(
    (p) => p._id === product._id
  );

  const addToWishlist = () => {
    setWishlist((prev) =>
      isLiked
        ? prev.filter((wid) => wid !== product._id)
        : [...prev, product._id]
    );
  };

  const addToCart = () => {
    if (!isInCart) {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const buyNow = () => {
    if (!isInCart) {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
    navigate("/checkout");
  };

  return (
    <div className="detail-container">
      <div className="detail-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="detail-info">
        <p className="detail-category">{product.category}</p>

        <h1>{product.name}</h1>

        <p className="detail-brand">
          Brand: {product.brand}
        </p>

        <p className="detail-rating">
          ⭐ {product.rating} / 5
        </p>

        <h2 className="detail-price">
          ₹{product.price.toLocaleString("en-IN")}
        </h2>

        <p className="detail-description">
          {product.description || "No description available."}
        </p>

        <p className="detail-stock">
          {product.stock > 0
            ? `In Stock: ${product.stock}`
            : "Out of Stock"}
        </p>

        <div className="detail-buttons">
          <button
            className="wishlist-btn"
            onClick={addToWishlist}
          >
            {isLiked ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
          </button>

          <button
            className="cart-btn"
            onClick={addToCart}
            disabled={product.stock <= 0 || isInCart}
          >
            {isInCart ? "Added to Cart ✓" : "🛒 Add to Cart"}
          </button>

          <button
            className="buy-now-btn"
            onClick={buyNow}
            disabled={product.stock <= 0}
          >
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detail;