
import { useContext } from "react";
import { data } from "../context/UserContext";
import Card from "./Card";

function Mobile() {
  const { item } = useContext(data);

  const mobileProducts = item.filter(
    (product) => product.category.toLowerCase() === "smartphone"
  );

  return (
    <div className="all-con">
      {mobileProducts.length > 0 ? (
        mobileProducts.map((product) => (
          <Card key={product._id} item={product} />
        ))
      ) : (
        <p>No smartphones match your selected filters.</p>
      )}
    </div>
  );
}

export default Mobile;
