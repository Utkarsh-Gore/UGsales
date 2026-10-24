
import { useContext } from "react";
import { data } from "../context/UserContext";
import Card from "./Card";

function Tv() {
  const { item } = useContext(data);

  const tvProducts = item.filter(
    (product) => product.category.toLowerCase() === "tv"
  );

  return (
    <div className="all-con">
      {tvProducts.length > 0 ? (
        tvProducts.map((product) => (
          <Card key={product._id} item={product} />
        ))
      ) : (
        <p>No TV products match your selected filters.</p>
      )}
    </div>
  );
}

export default Tv;
