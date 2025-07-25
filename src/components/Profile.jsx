import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import Orders from './orders';

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  if (!user) {
    return <div className="container mt-5">You must be logged in to view your profile.</div>;
  }

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      // Delete user from Firebase Auth
      await deleteUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Profile</h2>
      <div className="card p-3 mb-3">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
        {/* Add more user info here if needed */}
      </div>
      <button className="btn btn-info w-100 mb-3" onClick={() => setShowOrders(v => !v)}>
        {showOrders ? 'Hide' : 'Show'} My Orders
      </button>
      {showOrders && (
        <div className="mb-3">
          <Orders userId={user.uid} />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-danger w-100" onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Account'}
      </button>
    </div>
  );
}
