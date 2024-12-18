import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "../Styles/AddCategory.module.css"; 

function AddCategory() {
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send category name to the backend
    axios
      .post('http://localhost:3001/auth/add_category', { category })
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/category');
        } else {
          alert('Result Error');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Insert Category</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category Name
            </label>
            <input
              type="text"
              name="category"
              placeholder="Enter Category"
              onChange={(e) => setCategory(e.target.value)}
              className={styles.input}
            />
          </div>
          <button className={styles.button}>Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
