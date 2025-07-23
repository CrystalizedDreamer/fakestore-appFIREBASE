import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
function AddProducts(){

   const [form, setForm] = useState({
    productName: '',
    productPrice: '',
    productCategory: '',
    productDescription: '',
    image: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",

  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = {
      title: form.productName,
      price: parseFloat(form.productPrice),
      description: form.productDescription,
      category: form.productCategory,
      image: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    };
    try {
      const res = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: { 'Content-Type': 'application/json' }
      });
      await res.json();
      setMessage('Product added! (FakeStore API does not really DO new products, but yeah, good job.)');
      setForm({
        productName: '',
        productPrice: '',
        productCategory: '',
        productDescription: ''
      });
    } catch {
      setMessage('Error adding product.');
    }
  };
  return (
    <div>
      <form className="container mt-5" id="addProductForm" onSubmit={handleSubmit}>
      {message && <div className="alert alert-info">{message}</div>}
        <h2>Add Products</h2>
        <p>Here you can add new products.</p>
          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input type="text" className="form-control" id="productName"
            value={form.productName}
            onChange={handleChange} />
          </div>

            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">Product Price</label>
              <input type="number" className="form-control" id="productPrice"
              value={form.productPrice}
              onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="productCategory" className="form-label">Product Category</label>
              <input type="text" className="form-control" id="productCategory"
              value={form.productCategory}
              onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">Product Description</label>
              <textarea className="form-control" id="productDescription" rows="3"
              value={form.productDescription}
              onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Add Product</button>

      </form>

    </div>
  )
}
export default AddProducts;