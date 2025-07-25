

import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import ProductDetailsModal from './ProductDetailsModal';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { db } from '../Firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { addToCart } from '../store';

// Products component displays the list of products and handles product modals and cart actions
function Products() {
  // Redux dispatch for cart actions
  const dispatch = useDispatch();
  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // State for edit success message
  const [editMessage, setEditMessage] = useState("");
  // State for product details modal
  const [modalProduct, setModalProduct] = useState(null);
  // State for editing a product
  const [editProduct, setEditProduct] = useState(null);
  // State for the edit product form
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('all');
  // State for products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch all products from Firestore, optionally filtered by category
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'products');
      // If a category is selected, filter by category
      if (selectedCategory && selectedCategory !== 'all') {
        q = query(collection(db, 'products'), where('category', '==', selectedCategory));
      }
      const querySnapshot = await getDocs(q);
      const productsArr = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setProducts(productsArr);
    } catch (err) {
      alert('Error fetching products: ' + err.message);
    }
    setLoading(false);
  };

  // Fetch all unique categories from Firestore
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const allCategories = querySnapshot.docs.map(docSnap => docSnap.data().category);
      const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
      setCategories(uniqueCategories);
    } catch (err) {
      alert('Error fetching categories: ' + err.message);
    }
    setLoadingCategories(false);
  };

  // Fetch products when selectedCategory changes
  useEffect(() => {
    // Define fetchProducts inside useEffect to avoid dependency issues
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = collection(db, 'products');
        // If a category is selected, filter by category
        if (selectedCategory && selectedCategory !== 'all') {
          q = query(collection(db, 'products'), where('category', '==', selectedCategory));
        }
        const querySnapshot = await getDocs(q);
        const productsArr = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setProducts(productsArr);
      } catch (err) {
        alert('Error fetching products: ' + err.message);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory]);
  useEffect(() => {
    fetchCategories();
    //
  }, []);

  // Clear edit message after 3 seconds
  useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => setEditMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);

  // Show loading indicator while products or categories are being fetched
  if (loading || loadingCategories) return <div id="loading">Loading...</div>;

  return (
    <div className="container my-4">
      {/* Show edit success message if present */}
      {editMessage && (
        <div className="alert alert-success text-center" role="alert">
          {editMessage}
        </div>
      )}

      {/* Category Filter Dropdown (moved to CategoryFilter component) */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="row">
        {/* Render each product card using ProductCard component */}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => {
              setEditProduct(product);
              setEditForm({
                title: product.title,
                price: product.price,
                category: product.category,
                description: product.description,
                image: product.image,
              });
            }}
            onDetails={() => setModalProduct(product)}
            onAddToCart={() => dispatch(addToCart(product))}
          />
        ))}
      </div>
      {/* Product Details Modal */}
      <ProductDetailsModal product={modalProduct} onClose={() => setModalProduct(null)} />
      {/* Edit Product Modal with update logic using Firestore */}
      <EditProductModal
        editProduct={editProduct}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setEditProduct(null)}
        onDelete={() => setShowDeleteConfirm(true)}
        onSubmit={async (e) => {
          // Handle product update in Firestore
          e.preventDefault();
          try {
            const productRef = doc(db, 'products', editProduct.id);
            await updateDoc(productRef, {
              ...editForm,
              price: parseFloat(editForm.price),
            });
            setEditProduct(null);
            setEditForm({
              title: "",
              price: "",
              category: "",
              description: "",
              image: "",
            });
            setEditMessage("Product updated successfully!");
            fetchProducts();
          } catch (err) {
            alert("Error updating product: " + err.message);
          }
        }}
      />
      {/* Delete Confirm Modal with delete logic using Firestore */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onDelete={async () => {
          // Handle product delete in Firestore
          try {
            const productRef = doc(db, 'products', editProduct.id);
            await deleteDoc(productRef);
            setEditProduct(null);
            setEditMessage("Product deleted successfully!");
            fetchProducts();
          } catch (err) {
            alert("Error deleting product: " + err.message);
          }
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}

export default Products;
