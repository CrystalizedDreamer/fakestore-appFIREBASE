import React from "react";

// CategoryFilter component for selecting product category
export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="mb-4">
      <label htmlFor="categoryFilter" className="form-label me-2">
        Filter by Category:
      </label>
      <select
        id="categoryFilter"
        className="form-select d-inline-block w-auto"
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
