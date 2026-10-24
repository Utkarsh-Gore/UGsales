import { useContext } from "react";
import { data } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, setCart } = useContext(data);
  const navigate = useNavigate();

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="continue-btn" onClick={() => navigate("/all")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <p className="cart-count">{cart.length} item{cart.length > 1 ? "s" : ""} in your cart</p>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-brand">{item.brand} · {item.category}</p>
                <p className="cart-item-price">₹{item.price.toLocaleString("en-IN")}</p>
              </div>

              <div className="cart-item-actions">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(item._id, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>

                <p className="cart-item-total">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          {shipping === 0 && (
            <p className="free-shipping-note">🎉 You qualify for free shipping!</p>
          )}
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout →
          </button>
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/all")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
