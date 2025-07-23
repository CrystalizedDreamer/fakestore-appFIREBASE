import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store';

// Displays the items currently in the cart
export default function Cart() {
  // Get cart state and actions from the cart context
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  function checkout() {
    // Clear the cart and display a checkout success message
    dispatch(clearCart());
    alert("Checkout successful!.");
  }

  // If the cart is empty, show a message
  if (cart.length === 0) {
    return <div className="container my-4"><h4>There is nothing here...</h4></div>;
  }

  return (
    <div className="container my-4">
      {/* List all items in the cart */}
      <ul className="list-group mb-3">
        {cart.map((item, idx) => (
          <li key={item.id + '-' + idx} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 10 }} />
              <div>
                <strong>{item.title}</strong> <span className="text-muted">${item.price}</span>
              </div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {/* Total price display */}
      <div className="mt-3 text-end">
        <strong>Total: ${cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0).toFixed(2)}</strong>
      </div>
      {/* Button to clear the entire cart */}
      <button className="btn btn-warning" onClick={() => dispatch(clearCart())}>
        Clear Cart
      </button>
      <button className="btn btn-primary" onClick={() => dispatch(checkout())}>
        Checkout
      </button>
    </div>
  );
}
