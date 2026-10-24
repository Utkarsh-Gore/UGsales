
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-box">
          <h2 className="footer-logo">UG Sales<span>.</span></h2>
          <p>
            Shop smart, shop easy. Discover the best products
            at amazing prices with UG Sales.
          </p>

          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" aria-label="X">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">All Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-box">
          <h3>Categories</h3>
          <ul>
            <li><a href="/mobile">Mobiles</a></li>
            <li><a href="/fashion">Fashion</a></li>
            <li><a href="/electronics">Electronics</a></li>
            <li><a href="/beauty">Beauty</a></li>
            <li><a href="/sport">Sports</a></li>
          </ul>
        </div>
        <div className="footer-box">
          <h3>Customer Support</h3>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/shipping">Shipping Policy</a></li>
            <li><a href="/returns">Returns & Refunds</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 UG Sales. All rights reserved.</p>

        <div className="payment-icons">
          <i className="fa-brands fa-cc-visa"></i>
          <i className="fa-brands fa-cc-mastercard"></i>
          <i className="fa-solid fa-credit-card"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
