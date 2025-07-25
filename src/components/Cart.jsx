import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, incrementQuantity, decrementQuantity } from '../store';
import { db, auth } from '../Firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Displays the items currently in the cart
export default function Cart() {
  // Get cart state and actions from the cart context
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  async function checkout() {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    let orderNumber, exists = true, attempts = 0;
    // Try up to 5 times to generate a unique order number for this user
    while (exists && attempts < 5) {
      orderNumber = Math.floor(100000 + Math.random() * 900000);
      const q = query(collection(db, "orders"), where("userId", "==", user.uid), where("orderNumber", "==", orderNumber));
      const snapshot = await getDocs(q);
      exists = !snapshot.empty;
      attempts++;
    }
    if (exists) {
      alert("Could not generate a unique order number. Please try again.");
      return;
    }
    const orderData = {
      userId: user.uid,
      orderNumber,
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      })),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, "orders"), orderData);
      dispatch(clearCart());
      alert(`Order placed! Your order number is ${orderNumber}`);
    } catch (err) {
      alert("Error placing order: " + err.message);
    }
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
                <div className="input-group mt-2" style={{ maxWidth: 120 }}>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(decrementQuantity(item.id))} disabled={item.quantity <= 1}>-</button>
                  <input type="text" className="form-control form-control-sm text-center" value={item.quantity || 1} readOnly style={{ width: 40 }} />
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                </div>
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
      <button className="btn btn-primary" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
}
