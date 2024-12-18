import React, { useState } from "react";
import "../Styles/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:3001/auth/adminlogin", values)
  .then((result) => {
    if (result.data.loginStatus) {
      localStorage.setItem("valid", "true");
      localStorage.setItem("role", "admin"); // Set role as admin
      alert("Login Successful");
      navigate("/dashboard");
    } else {
      setError(result.data.error);
        }
      })
      .catch((err) => {
        console.error("Login request failed:", err);
        setError("Something went wrong. Please try again later.");
      });
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Log In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" className="login-label"></label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your email"
            className="login-input"
            onChange={(e) =>
              setValues({ ...values, email: e.target.value.trim() }) // Trim input
            }
          />

          <label htmlFor="password" className="login-label"></label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="login-input"
            onChange={(e) =>
              setValues({ ...values, password: e.target.value.trim() }) // Trim input
            }
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
