import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditEmployee() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    qualification: "",
    specialization: "",
    institution: "",
    graduationYear: "",
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

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3001/auth/employees/" + id)
      .then((result) => {
        setEmployeeData({
          ...employeeData,
          name: result.data.Result[0].name,
          password: "", // Password is not typically returned from an API for security reasons
          dob: result.data.Result[0].dob
            ? new Date(result.data.Result[0].dob).toISOString().split("T")[0]
            : "",
          gender: result.data.Result[0].gender || "",
          phone: result.data.Result[0].phone || "",
          email: result.data.Result[0].email || "",
          address: result.data.Result[0].address || "",
          qualification: result.data.Result[0].qualification || "",
          specialization: result.data.Result[0].specialization || "",
          institution: result.data.Result[0].institution || "",
          graduationYear: result.data.Result[0].graduationYear || "",
          photo: result.data.Result[0].photo || null,
          employeeId: result.data.Result[0].employeeId || "",
          designation: result.data.Result[0].designation || "",
          category_name: result.data.Result[0].category_name || "",
          joiningDate: result.data.Result[0].joiningDate
            ? new Date(result.data.Result[0].joiningDate)
                .toISOString()
                .split("T")[0]
            : "",
          salary: result.data.Result[0].salary || "",
          workMode: result.data.Result[0].workMode || "",
          workLocation: result.data.Result[0].workLocation || "",

          accountHolderName: result.data.Result[0].accountHolderName || "",
          bankName: result.data.Result[0].bankName || "",
          branchName: result.data.Result[0].branchName || "",
          accountNumber: result.data.Result[0].accountNumber || "",
          ifscCode: result.data.Result[0].ifscCode || "",
          accountType: result.data.Result[0].accountType || "",
        });
      })
      .catch((err) => console.log(err));
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

    axios
      .put(`http://localhost:3001/auth/edit_employee/${id}`, employeeData)
      .then((result) => {
        console.log("Response from backend:", result.data); // Log backend response
        if (result.data.Status) {
          alert("Updated the Profile successfully!");
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
    <div className="add-employee-container">
      <form className="add-employee-form" onSubmit={handleSubmit}>
        {/* Personal Info Section */}
        <div className="form-section personal-info">
          <h3>Edit Personal Info</h3>
          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={employeeData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={employeeData.address}
              onChange={handleChange}
              placeholder="Enter Address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="qualification">Qualification</label>
            <input
              type="text"
              id="qualification"
              value={employeeData.qualification}
              onChange={handleChange}
              placeholder="Enter Qualification"
            />
          </div>
          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              value={employeeData.specialization}
              onChange={handleChange}
              placeholder="Enter Specialization"
            />
          </div>
          <div className="form-group">
            <label htmlFor="institution">Institution</label>
            <input
              type="text"
              id="institution"
              value={employeeData.institution}
              onChange={handleChange}
              placeholder="Enter Institution"
            />
          </div>
          <div className="form-group">
            <label htmlFor="graduationYear">Graduation Year</label>
            <input
              type="number"
              id="graduationYear"
              value={employeeData.graduationYear}
              onChange={handleChange}
              placeholder="Enter Year"
            />
          </div>
        </div>

        {/* Company Info Section */}
        <div className="form-section company-info">
          <h3>Edit Info Regarding Company</h3>
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeData.employeeId}
              onChange={handleChange}
              placeholder="Enter Employee ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              value={employeeData.designation}
              onChange={handleChange}
              placeholder="Enter Designation"
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="joiningDate">Joining Date</label>
            <input
              type="date"
              id="joiningDate"
              value={employeeData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="workLocation">Work Location</label>
            <input
              type="text"
              id="workLocation"
              value={employeeData.workLocation}
              onChange={handleChange}
              placeholder="Enter Work Location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountType">Employment Type</label>
            <select
              id="accountType"
              value={employeeData.accountType}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData.bankDetails,
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

          <h3>Edit Bank Account Details</h3>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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

        <div className="form-group submit-btn">
          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default EditEmployee;
