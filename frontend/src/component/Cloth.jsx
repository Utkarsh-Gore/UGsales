
import { useContext } from "react";
import { data } from "../context/UserContext";
import Card from "./Card";

function Cloth() {
  const { item } = useContext(data);

  const clothProducts = item.filter(
    (product) => product.category.toLowerCase() === "clothing"
  );

  return (
    <div className="all-con">
      {clothProducts.length > 0 ? (
        clothProducts.map((product) => (
          <Card key={product._id} item={product} />
        ))
      ) : (
        <p>No clothing products match your selected filters.</p>
      )}
    </div>
  );
}

export default Cloth;
