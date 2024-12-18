import React, { useEffect, useState } from "react";
import "../Styles/Home.css"
import axios from "axios";
function Home() {
  const [adminTotal,setAdminTotal]=useState(0)
  const [employeeTotal,setEmployeeTotal]=useState(0)
  const [attendanceCounts, setAttendanceCounts] = useState({ present: 0, absent: 0, halfDay: 0 });
  const [leaveCounts, setLeaveCounts] = useState({ approved: 0, rejected: 0 }); // Add state for leave counts

  useEffect(() => {
    adminCount();
    employeeCount();
    fetchAttendanceCounts();
    fetchLeaveCounts()
  }, []);
  const adminCount = () => {
    axios.get("http://localhost:3001/auth/admin_count")
        .then(result => {
            console.log("API Response:", result.data);
            // Fix capitalization issue: Access 'Result' instead of 'result'
            if (result.data.Status && Array.isArray(result.data.Result) && result.data.Result.length > 0) {
                setAdminTotal(result.data.Result[0].admin); // Access the correct property
            } else {
                console.warn("No admin data found or unexpected structure");
                setAdminTotal(0); // Default value
            }
        })
        .catch(error => {
            console.error("Error fetching admin count:", error);
            setAdminTotal(0); // Default value on error
        });
};

const employeeCount = () => {
  axios.get("http://localhost:3001/auth/employee_count")
      .then(result => {
          console.log("API Response:", result.data)
          if (result.data.Status && Array.isArray(result.data.Result) && result.data.Result.length > 0) {
              setEmployeeTotal(result.data.Result[0].employee); 
          } else {
              console.warn("No admin data found or unexpected structure");
              setEmployeeTotal(0);
          }
      })
      .catch(error => {
          console.error("Error fetching admin count:", error);
          setAdminTotal(0); // Default value on error
      });
};

const fetchAttendanceCounts = () => {
  axios.get("http://localhost:3001/attendance/counts", { withCredentials: true })
    .then(result => {
      setAttendanceCounts({
        present: result.data.present,
        absent: result.data.absent,
        halfDay: result.data.halfDay,
      });
    })
    .catch(error => console.log(error));
};

const fetchLeaveCounts = () => {
  axios
    .get("http://localhost:3001/leave/counts")
    .then((response) => {
      setLeaveCounts({
        approved: response.data.approved,
        rejected: response.data.rejected,
      });
    })
    .catch((err) => console.error(err));
};


  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Employee Management System</h1>
        <p>Hi Admin, Welcome back!</p>
      </header>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Admin</h3>
          <p>Total : {adminTotal}</p>
        </div>
        <div className="stat-card">
          <h3>Employees</h3>
          <p>Total : {employeeTotal}</p>
        </div>
        <div className="stat-card">
          <h3>Present</h3>
          <p>Total : {attendanceCounts.present}</p>
        </div>
        <div className="stat-card">
          <h3>Absent</h3>
          <p>Total : {attendanceCounts.absent}</p>
        </div>
        <div className="stat-card">
          <h3>Half-Day</h3>
          <p>Total : {attendanceCounts.halfDay}</p>
        </div>
        
        <div className="stat-card">
    <h3>Leave Approved</h3>
    <p>Total: {leaveCounts.approved}</p>
</div>
<div className="stat-card">
    <h3>Leave Rejected</h3>
    <p>Total: {leaveCounts.rejected}</p>
</div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>50</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p>30</p>
        </div>
        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <p>20</p>
        </div>
        <div className="stat-card">
          <h3>Add Task</h3>
          <button>Add Task</button>
        </div>
        
      </div>
    </div>
  );
}

export default Home;
