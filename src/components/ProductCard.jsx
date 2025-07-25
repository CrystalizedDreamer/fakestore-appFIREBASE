import React from "react";

// ProductCard component for displaying a single product
export default function ProductCard({ product, onEdit, onDetails, onAddToCart }) {
  return (
    <div className="col-12 col-sm-6 col-md-3 mb-4 mt-4 pt-2 pb-2">
      <div className="card h-100" id="productCard">
        <img src={product.image} className="card-img-top" alt={product.title} />
        <div className="cardBody">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">${product.price}</p>
          <p className="card-text">{product.category}</p>
          <p className="card-text" style={{ fontSize: "0.9em" }}>
            {product.description && product.description.substring(0, 80)}...
          </p>
          <div className="d-flex flex-column gap-2 mt-auto">
            <button className="btn btn-outline-warning w-100" onClick={onEdit}>
              Edit
            </button>
            <button className="btn btn-outline-secondary btn-sm w-100" onClick={onDetails}>
              Details
            </button>
            <button className="btn btn-primary btn-sm w-100" onClick={onAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
