import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { data } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Checkout.css";

const API = "http://localhost:8080/api";

function Checkout() {
  const { cart, setCart } = useContext(data);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const { name, phone, street, city, state, pincode } = address;
    if (!name || !phone || !street || !city || !state || !pincode) {
      setError("Please fill all address fields");
      return false;
    }
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  };

  const handlePayment = async () => {
    if (!validateAddress()) return;
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Razorpay order
      const { data: paymentData } = await axios.post(
        `${API}/payment/create-order`,
        { amount: total },
        { withCredentials: true }
      );

      // Step 2: Open Razorpay checkout
      const options = {
        key: paymentData.key,
        amount: paymentData.order.amount,
        currency: "INR",
        name: "UG Sales",
        description: `Order of ${cart.length} item(s)`,
        order_id: paymentData.order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const { data: verifyData } = await axios.post(
              `${API}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyData.success) {
              // Step 4: Create order in backend
              const orderItems = cart.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
              }));

              await axios.post(
                `${API}/orders`,
                {
                  items: orderItems,
                  shippingAddress: address,
                  paymentInfo: verifyData.paymentInfo,
                  totalAmount: total,
                },
                { withCredentials: true }
              );

              // Clear cart and redirect
              setCart([]);
              navigate("/order-success");
            }
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
            console.error(err);
          }
        },
        prefill: {
          name: address.name,
          email: user?.email || "",
          contact: address.phone,
        },
        theme: {
          color: "#667eea",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>No items to checkout</h2>
          <p>Add some items to your cart first.</p>
          <button onClick={() => navigate("/all")} className="back-btn">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <div className="checkout-card">
            <h2><i className="fa-solid fa-location-dot"></i> Shipping Address</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={address.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  type="tel"
                />
              </div>

              <div className="form-group full-width">
                <label>Street Address</label>
                <input
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="House no, Building, Street, Area"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label>PIN Code</label>
                <input
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <h2><i className="fa-solid fa-box"></i> Order Items ({cart.length})</h2>
            <div className="checkout-items">
              {cart.map((item) => (
                <div className="checkout-item" key={item._id}>
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="checkout-item-total">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="checkout-summary">
          <div className="checkout-card">
            <h2>Payment Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <span>💳 Pay ₹{total.toLocaleString("en-IN")}</span>
              )}
            </button>

            <div className="secure-badge">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Secured by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
