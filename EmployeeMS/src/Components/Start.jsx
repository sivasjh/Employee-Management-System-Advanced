import React from "react";
import styles from "../Styles/Start.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const Start = () => {
  const quotes = [
    "Great things in business are never done by one person. They're done by a team of people.",
    "The strength of the team is each individual member. The strength of each member is the team.",
    "Employee growth is the foundation of company success.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const navigate = useNavigate();

  // Handle navigation for Admin and Employee buttons
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  useEffect(() => {
    axios.get(`http://localhost:3001/verify`, { withCredentials: true })
      .then(result => {
        console.log("Received response:", result);
        if(result.data.Status) {
          if(result.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/employee_detail/" + result.data.id);
          }
        }
      })
      .catch(err => console.log(err));
  }, []);
  
  return (
    <div className={styles.loginAsModern}>
      <div className={styles.leftModern}>
        <h1>Welcome to Employee Management System</h1>
        <p className={styles.quote}>"{randomQuote}"</p>
        <p>- The Leader</p>
      </div>

      <div className={styles.rightModern}>
        <div className={styles.loginBox}>
          <h2>Login As</h2>
          <button
            className={`${styles.modernBtn} ${styles.adminBtn}`}
            onClick={() => handleNavigation("/adminlogin")}
          >
            Admin
          </button>
          <button
            className={`${styles.modernBtn} ${styles.employeeBtn}`}
            onClick={() => handleNavigation("/employee_login")}
          >
            Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
