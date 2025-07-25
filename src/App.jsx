
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import  { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import React from 'react';     
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from './store';
import Cart from './components/Cart.jsx';
import Products from './components/products.jsx'; 
import AddProducts  from './components/addProducts.jsx';
import Home from './components/home.jsx';


import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx';
import { logout } from './authService';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';



function App() {
  // State to control cart modal visibility
  const [showCart, setShowCart] = React.useState(false);
  // Use Redux for cart state and actions
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  // Calculate total price
  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
  // Calculate total quantity of items in cart
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Track auth state
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-products">Add Products</Link>
              </li>
              {!user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
            <div className="d-flex align-items-center ms-auto">
              {user && (
                <Link to="/profile" className="text-light me-3" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                  Welcome {user.email}
                </Link>
              )}
              <button className="btn btn-success me-2" onClick={() => setShowCart(true)}>
                View Cart ({totalQuantity})
              </button>
              {user && (
                <button className="btn btn-outline-light" onClick={logout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Cart Modal using Cart component */}
        {showCart && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Your Cart</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCart(false)}></button>
                </div>
                <div className="modal-body">
                  <Cart />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowCart(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-products" element={<AddProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
