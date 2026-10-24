
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function Payment() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, {
        withCredentials: true,
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading payments...</h2>;
  }

  const payments = orders.filter(
    (order) => order.paymentInfo?.status === "paid"
  );

  return (
    <div className="orders-page">
      <h1>Payment History</h1>
      <p>{payments.length} Successful Payments</p>

      <div className="orders-list">
        {payments.length === 0 ? (
          <h3>No payment history found</h3>
        ) : (
          payments.map((order) => (
            <div className="order-card" key={order._id}>

              <h3>Payment Details</h3>

              <p>
                <strong>Order ID:</strong> {order._id}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>

              <p>
                <strong>Amount:</strong> ₹
                {order.totalAmount.toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentInfo.method}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {order.paymentInfo.status}
              </p>

              <p>
                <strong>Razorpay Order ID:</strong>{" "}
                {order.paymentInfo.razorpayOrderId}
              </p>

              <p>
                <strong>Transaction ID:</strong>{" "}
                {order.paymentInfo.razorpayPaymentId}
              </p>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Payment;
