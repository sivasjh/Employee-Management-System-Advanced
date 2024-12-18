import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Styles/AddEmployee.module.css";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    qualification: "",
    specialization: "",
    institution: "",
    graduationYear: "",
    photo: null,
    employeeId: "",
    designation: "",
    category_name: "",
    joiningDate: "",
    salary: "",
    workMode: "",
    workLocation: "",
    accountHolderName: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const result = await axios.get("http://localhost:3001/auth/category");
      console.log("Categories fetched:", result.data); // Log categories
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
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(`Changed ${id} to ${value}`); // Log field changes
    setEmployeeData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value; // Get the selected category name
    console.log(`Category selected: ${value}`); // Log category change
    setEmployeeData((prevData) => ({
      ...prevData,
      category_name: value, // Save the category name in the state
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log file selection
    if (file && file.type.startsWith("image")) {
      setEmployeeData((prevData) => ({
        ...prevData,
        photo: file, // Save the actual file for upload
      }));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for missing required fields
    console.log("Employee Data on Submit:", employeeData); // Log all employee data
    if (
      !employeeData.name ||
      !employeeData.dob ||
      !employeeData.gender ||
      !employeeData.phone ||
      !employeeData.email ||
      !employeeData.category_name ||
      !employeeData.employeeId ||
      !employeeData.designation ||
      !employeeData.joiningDate ||
      !employeeData.salary ||
      !employeeData.workMode
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create a FormData object to send form data (including file upload)
    const formData = new FormData();
    Object.entries(employeeData).forEach(([key, value]) => {
      if (key === "photo" && value) {
        formData.append("photo", value);
      } else {
        formData.append(key, value);
      }
    });

    // Log FormData to see what we're sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]); // Log each form data pair
    }

    // Send the formData to the backend
    axios
      .post("http://localhost:3001/auth/add_employee", formData)
      .then((result) => {
        console.log("Response from backend:", result.data); // Log backend response
        if (result.data.Status) {
          alert("Employee added successfully!");
          navigate("/dashboard/employees");
        } else {
          alert(
            `Error adding employee: ${result.data.Error || "Unknown error"}`
          );
        }
      })
      .catch((err) => {
        console.error("Error occurred:", err.response || err.message || err); // Log errors
      });
  };

  return (
    <div className={styles.addEmployeeContainer}>
      <form className={styles.addEmployeeForm} onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <h3>Personal Info</h3>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={employeeData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={employeeData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={employeeData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={employeeData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="number"
              id="phone"
              value={employeeData.phone}
              onChange={handleChange}
              placeholder="Enter Phone"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={employeeData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={employeeData.address}
              onChange={handleChange}
              placeholder="Enter Address"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="qualification">Qualification</label>
            <input
              type="text"
              id="qualification"
              value={employeeData.qualification}
              onChange={handleChange}
              placeholder="Enter Qualification"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              value={employeeData.specialization}
              onChange={handleChange}
              placeholder="Enter Specialization"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="institution">Institution</label>
            <input
              type="text"
              id="institution"
              value={employeeData.institution}
              onChange={handleChange}
              placeholder="Enter Institution"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="graduationYear">Graduation Year</label>
            <input
              type="number"
              id="graduationYear"
              value={employeeData.graduationYear}
              onChange={handleChange}
              placeholder="Enter Year"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              onChange={handleFileChange}
              accept="image/*"
            />
            {employeeData.photo && (
              <div className={styles.photoPreview}>
                <img
                  src={URL.createObjectURL(employeeData.photo)}
                  alt="Preview"
                  className={styles.previewImg}
                />
              </div>
            )}
          </div>
        </div>

        {/* Company Info Section */}
        <div className={styles.formSection}>
          <h3>Info Regarding Company</h3>
          <div className={styles.formGroup}>
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeData.employeeId}
              onChange={handleChange}
              placeholder="Enter Employee ID"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              value={employeeData.designation}
              onChange={handleChange}
              placeholder="Enter Designation"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category_name">Category</label>
            <select
              id="category_name"
              value={employeeData.category_name}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="joiningDate">Joining Date</label>
            <input
              type="date"
              id="joiningDate"
              value={employeeData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="salary">Salary</label>
            <input
              type="number"
              id="salary"
              value={employeeData.salary}
              onChange={handleChange}
              placeholder="Enter Salary"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="workMode">Work Mode</label>
            <select
              id="workMode"
              value={employeeData.workMode}
              onChange={handleChange}
            >
              <option value="">Select Work Mode</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="workLocation">Work Location</label>
            <input
              type="text"
              id="workLocation"
              value={employeeData.workLocation}
              onChange={handleChange}
              placeholder="Enter Work Location"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="accountType">Employment Type</label>
            <select
              id="accountType"
              value={employeeData.accountType}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  accountType: e.target.value,
                }))
              }
            >
              <option value="">Employement Type</option>
              <option value="FullTime">Full-Time</option>
              <option value="PartTime">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <h3>Bank Account Details</h3>
          <div className={styles.formGroup}>
            <label htmlFor="accountHolderName">Account Holder Name</label>
            <input
              type="text"
              id="accountHolderName"
              value={employeeData.accountHolderName}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,

                  accountHolderName: e.target.value,
                }))
              }
              placeholder="Enter Account Holder Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              value={employeeData.bankName}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  bankName: e.target.value,
                }))
              }
              placeholder="Enter Bank Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="branchName">Branch Name</label>
            <input
              type="text"
              id="branchName"
              value={employeeData.branchName}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,

                  branchName: e.target.value,
                }))
              }
              placeholder="Enter Branch Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="number"
              id="accountNumber"
              value={employeeData.accountNumber}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  accountNumber: e.target.value,
                }))
              }
              placeholder="Enter Account Number"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="ifscCode">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              value={employeeData.ifscCode}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,

                  ifscCode: e.target.value,
                }))
              }
              placeholder="Enter IFSC Code"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <button type="submit">Create Profile Employee</button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
