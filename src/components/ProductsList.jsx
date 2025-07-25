import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import ProductDetailsModal from "./ProductDetailsModal";
import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { db } from "../Firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addToCart } from "../store";

// Main container for products logic and state
export default function ProductsList() {
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = collection(db, "products");
        if (selectedCategory && selectedCategory !== "all") {
          q = query(collection(db, "products"), where("category", "==", selectedCategory));
        }
        const querySnapshot = await getDocs(q);
        const productsArr = querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setProducts(productsArr);
      } catch (err) {
        alert("Error fetching products: " + err.message);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory]);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const allCategories = querySnapshot.docs.map((docSnap) => docSnap.data().category);
        const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        alert("Error fetching categories: " + err.message);
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  // Clear edit message after 3 seconds
  useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => setEditMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);

  if (loading || loadingCategories) return <div id="loading">Loading...</div>;

  return (
    <div className="container my-4">
      {editMessage && (
        <div className="alert alert-success text-center" role="alert">
          {editMessage}
        </div>
      )}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="row">
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
      <ProductDetailsModal product={modalProduct} onClose={() => setModalProduct(null)} />
      <EditProductModal
        editProduct={editProduct}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setEditProduct(null)}
        onDelete={() => setShowDeleteConfirm(true)}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const productRef = doc(db, "products", editProduct.id);
            await updateDoc(productRef, {
              ...editForm,
              price: parseFloat(editForm.price),
            });
            setEditProduct(null);
            setEditForm({ title: "", price: "", category: "", description: "", image: "" });
            setEditMessage("Product updated successfully!");
            // Refetch products
            const querySnapshot = await getDocs(collection(db, "products"));
            setProducts(querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
          } catch (err) {
            alert("Error updating product: " + err.message);
          }
        }}
      />
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onDelete={async () => {
          try {
            const productRef = doc(db, "products", editProduct.id);
            await deleteDoc(productRef);
            setEditProduct(null);
            setEditMessage("Product deleted successfully!");
            // Refetch products
            const querySnapshot = await getDocs(collection(db, "products"));
            setProducts(querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
          } catch (err) {
            alert("Error deleting product: " + err.message);
          }
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}
