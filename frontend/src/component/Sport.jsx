import { useContext } from "react";
import { data } from "../context/UserContext";
import Card from "./Card";

function Sport() {
  const { item } = useContext(data);

  const sportProducts = item.filter(
    (product) => product.category.toLowerCase() === "sports"
  );

  return (
    <div className="all-con">
      {sportProducts.length > 0 ? (
        sportProducts.map((product) => (
          <Card key={product._id} item={product} />
        ))
      ) : (
        <p>No sports products match your selected filters.</p>
      )}
    </div>
  );
}

export default Sport;