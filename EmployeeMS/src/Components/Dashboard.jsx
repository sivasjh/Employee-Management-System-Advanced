import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "../Styles/Dashboard.module.css";
import {
  FaHome,
  FaUsers,
  FaThList,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
function Dashboard() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get("http://localhost:3001/auth/logout").then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid")
        navigate("/");
      }
    });
  };
  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Employee Portal</h2>
        <ul className={styles.sidebarMenu}>
          <li>
            <Link to="/dashboard" className={styles.menuItem}>
              <FaHome className={styles.menuIcon} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/employees" className={styles.menuItem}>
              <FaUsers className={styles.menuIcon} />
              Manage Employees
            </Link>
          </li>
          <li>
            <Link to="/dashboard/category" className={styles.menuItem}>
              <FaThList className={styles.menuIcon} />
              Category
            </Link>
          </li>
          <li>
            <Link to="/dashboard/attendance" className={styles.menuItem}>
              <FaUser className={styles.menuIcon} />
              Attendance
            </Link>
          </li>
          <li>
            <Link to="/dashboard/leave" className={styles.menuItem}>
              <FaUser className={styles.menuIcon} />
              Leave & Approvals
            </Link>
          </li>
          <li>
            <Link to="/dashboard/payment" className={styles.menuItem}>
              <FaUser className={styles.menuIcon} />
              Payment Slip
            </Link>
          </li>
          
          <li onClick={handleLogout}>
            <Link to="/logout" className={`${styles.menuItem} ${styles.logoutItem}`}>
              <FaSignOutAlt className={styles.menuIcon} />
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.mainHeading}>
          <h4> </h4>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
