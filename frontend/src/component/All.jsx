import { useContext } from "react";
import "./All.css";
import Card from "./Card";
import { data } from "../context/UserContext";

function All() {
  const { item, loading } = useContext(data);

  if (loading) {
    return (
      <div className="all-con" style={{ justifyContent: "center", padding: "60px" }}>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="all-con">
      {item.length > 0 ? (
        item.map((it) => (
          <Card key={it._id} item={it} />
        ))
      ) : (
        <h3 className="no-products">No products found!</h3>
      )}
    </div>
  );
}

export default All;