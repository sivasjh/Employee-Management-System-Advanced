import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Category.css';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const result = await axios.get("http://localhost:3001/auth/category");
      if (result.data.Status) {
        setCategories(result.data.Result);
      } else {
        alert("Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error.response || error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Load categories when the component mounts
  }, []);

  return (
    <div className="category-container">
      <div className="header-container">
        <h3>Category List</h3>
      </div>
      <Link to="/dashboard/add_category" className="add-category-btn">
        <b>+ </b> Insert Category
      </Link>
      <div className="card-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.name}>
            <h4>{category.name}</h4>
            <p>Category Name: {category.name}</p> {/* Displaying category name instead of index */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
