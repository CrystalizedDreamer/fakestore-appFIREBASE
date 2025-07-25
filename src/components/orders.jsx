import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

// Orders component: displays and manages orders from Firestore
export default function Orders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders for the current user
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      let q = collection(db, "orders");
      if (userId) {
        q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
      }
      const querySnapshot = await getDocs(q);
      const ordersArr = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setOrders(ordersArr);
    } catch (err) {
      setError("Error fetching orders: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [userId]);

  // ...existing code...

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <ul className="list-group">
          {orders.map(order => (
            <li key={order.id} className="list-group-item">
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Date:</strong> {order.createdAt}</div>
              <div><strong>Status:</strong> {order.status || "Pending"}</div>
              <div><strong>Items:</strong>
                <ul>
                  {order.items && order.items.map((item, idx) => (
                    <li key={idx}>{item.title} x {item.quantity} <span className="text-muted">@ ${item.price} ea</span></li>
                  ))}
                </ul>
              </div>
              <div><strong>Total:</strong> ${order.items ? order.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2) : '0.00'}</div>
              {/* Example admin actions: */}
              {/* <button onClick={() => updateOrder(order.id, { status: "Shipped" })}>Mark as Shipped</button> */}
              {/* <button onClick={() => deleteOrder(order.id)}>Delete</button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
