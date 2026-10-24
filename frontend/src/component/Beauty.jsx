
import { useContext } from "react";
import { data } from "../context/UserContext";
import Card from "./Card";

function Beauty() {
  const { item } = useContext(data);

  const beautyProducts = item.filter(
    (product) => product.category.toLowerCase() === "beauty"
  );

  return (
    <div className="all-con">
      {beautyProducts.length > 0 ? (
        beautyProducts.map((product) => (
          <Card key={product._id} item={product} />
        ))
      ) : (
        <p>No Beauty products match your selected filters.</p>
      )}
    </div>
  );
}

export default Beauty;
