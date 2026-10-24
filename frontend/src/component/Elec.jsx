
import { useContext } from "react";
import { data } from "../context/UserContext";
import Card from "./Card";

function Elec() {
  const { item } = useContext(data);

  const elecProducts = item.filter(
    (product) => product.category.toLowerCase() === "electronics"
  );

  return (
    <div className="all-con">
      {elecProducts.length > 0 ? (
        elecProducts.map((product) => (
          <Card key={product._id} item={product} />
        ))
      ) : (
        <p>No Electronics products match your selected filters.</p>
      )}
    </div>
  );
}

export default Elec;
