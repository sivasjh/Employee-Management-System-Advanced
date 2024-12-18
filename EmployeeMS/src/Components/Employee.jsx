import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/Employee.css";

function Employee() {
  const [employees, setEmployees] = useState([]);

  // Fetch employees data from the server
  const fetchEmployees = async () => {
    try {
      const result = await axios.get("http://localhost:3001/auth/employees");

      // Check for a valid response
      if (result.data.Status) {
        setEmployees(result.data.Result); // Assuming 'Result' contains the employee array
      } else {
        alert("Error fetching employee data");
      }
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error.response ? error.response : error.message
      );
    }
  };

  useEffect(() => {
    fetchEmployees(); // Load employees when the component mounts
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:3001/auth/delete_employee/${id}`)
        .then((result) => {
          if (result.data.Status) {
            setEmployees((prevEmployees) =>
              prevEmployees.filter((employee) => employee.id !== id)
            );
          } else {
            alert(result.data.Error);
          }
        })
        .catch((error) => {
          console.error(
            "Error deleting employee:",
            error.response ? error.response.data : error.message
          );
        });
    }
  };
  

  return (
    <div className="category-container">
      {/* Header Section */}
      <div className="header-container">
        <h3>Employee List</h3>
      </div>

      {/* Link to Add Employee */}
      <Link to="/dashboard/add_employee" className="add-category-btn">
        <b>+ </b> Insert Employee
      </Link>

      {/* Employee List Container */}
      <div className="employee-list-container">
        <div className="card-grid">
          {/* Map over employees and render each employee card */}
          {employees.length > 0 ? (
            employees.map((employeeData) => (
              <div className="employee-card" key={employeeData.employeeId}>
                <h4>{employeeData.name}</h4>
                <p>Phone: {employeeData.phone}</p>
                <p>Email: {employeeData.email}</p>
                <div className="photo-preview">
                  {employeeData.photo && (
                    <img
                      src={`http://localhost:3001/${employeeData.photo}`} // Correct image URL
                      alt="Employee"
                      className="preview-img"
                    />
                  )}
                </div>
                <p>Designation: {employeeData.designation}</p>
                <p>Salary: {employeeData.salary}</p>
                <div className="button-container">
                  <Link to={`/dashboard/edit_employee/`+employeeData.id} 
                  type="button" className="edit-btn">
                    Edit
                  </Link>
                  <button type="button" className="delete-btn" onClick={()=>handleDelete(employeeData.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No employees found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employee;
