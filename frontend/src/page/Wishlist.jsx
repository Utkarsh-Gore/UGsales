import { useContext } from "react";
import { data } from "../context/UserContext";

import "./Wishlist.css";
import Card from "../component/Card";

function Wishlist() {
  const { allProducts, wishlist } = useContext(data);

  const wishlistProducts = allProducts.filter((product) =>
    wishlist.includes(product._id)
  );

  return (
    <div className="wishlist-container">
      <h1>My Wishlist ❤️</h1>

      {wishlistProducts.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Your wishlist is empty!</h2>
          <p>Like your favorite products to see them here.</p>
        </div>
      ) : (
        <div className="wishlist-products">
          {wishlistProducts.map((product) => (
            <Card key={product._id} item={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;