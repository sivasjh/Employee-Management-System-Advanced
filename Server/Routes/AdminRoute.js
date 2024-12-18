import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";

// Ensure 'uploads' directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Multer: Setting file destination to 'uploads/'");
    cb(null, uploadsDir); // Save files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    console.log(
      `Multer: Setting filename to ${
        Date.now() + path.extname(file.originalname)
      }`
    );
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

// Admin login route
router.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;
  console.log(`Admin login request with email: ${email}`);

  const emailCheckSql = "SELECT * FROM admin WHERE email = ?";
  con.query(emailCheckSql, [email], (err, result) => {
    if (err) {
      console.log("Database query error:", err);
      return res.json({ loginStatus: false, error: "Query error" });
    }

    if (result.length === 0) {
      console.log("Email not found.");
      return res.json({
        loginStatus: false,
        error: "Invalid email or password", // Generic error for security
      });
    }

    const user = result[0];
    if (user.password === password) {
      const token = jwt.sign(
        { role: "admin", email: user.email, id: user.id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
      });

      console.log("Admin logged in successfully.");
      return res.json({ loginStatus: true });
    } else {
      console.log("Invalid password.");
      return res.json({
        loginStatus: false,
        error: "Invalid email or password", // Generic error for security
      });
    }
  });
});


// Fetch categories
router.get("/category", (req, res) => {
  console.log("Fetching categories...");

  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    console.log("Categories fetched:", result);
    return res.json({ Status: true, Result: result });
  });
});

// Add category
router.post("/add_category", (req, res) => {
  console.log("Adding category:", req.body.category);

  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) {
      console.error("Error adding category:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    console.log("Category added successfully.");
    return res.json({ Status: true });
  });
});

// Add employee route with image upload
router.post("/add_employee", upload.single("photo"), async (req, res) => {
  const {
    name,
    password,
    dob,
    gender,
    phone,
    email,
    address,
    qualification,
    specialization,
    institution,
    graduationYear,
    employeeId,
    designation,
    category_name,
    joiningDate,
    salary,
    workMode,
    workLocation, // New field
    accountHolderName, // New field
    bankName, // New field
    branchName, // New field
    accountNumber, // New field
    ifscCode, // New field
    accountType, // New field
  } = req.body;

  // Get the photo path (if uploaded)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const photoPath = req.file ? `uploads/${req.file.filename}` : null;

    console.log("Adding employee with details:", {
      name,
      dob,
      gender,
      phone,
      email,
      address,
      qualification,
      specialization,
      institution,
      graduationYear,
      photo: photoPath,
      employeeId,
      designation,
      category_name,
      joiningDate,
      salary,
      workMode,
      workLocation,
      accountHolderName,
      bankName,
      branchName,
      accountNumber,
      ifscCode,
      accountType,
    });

    // SQL query to insert the employee
    const sql = `
      INSERT INTO employee (
        name, password, dob, gender, phone, email, address, qualification, specialization,
        institution, graduationYear, photo, employeeId, designation, category_name,
        joiningDate, salary, workMode, workLocation, accountHolderName,
        bankName, branchName, accountNumber, ifscCode, accountType
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    con.query(
      sql,
      [
        name,
        hashedPassword,
        dob,
        gender,
        phone,
        email,
        address,
        qualification,
        specialization,
        institution,
        graduationYear,
        photoPath,
        employeeId,
        designation,
        category_name,
        joiningDate,
        salary,
        workMode,
        workLocation,
        accountHolderName,
        bankName,
        branchName,
        accountNumber,
        ifscCode,
        accountType,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding employee:", err);
          return res.status(500).json({ Status: false, Error: "Query Error" });
        }
        console.log("Employee added successfully.");
        return res
          .status(201)
          .json({ Status: true, Message: "Employee added successfully" });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    return res
      .status(500)
      .json({ Status: false, Error: "Password Hashing Error" });
  }
});

// Fetch employees
router.get("/employees", (req, res) => {
  console.log("Fetching employees...");

  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    console.log("Employees fetched:", result);
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employees/:id", (req, res) => {
  const id = req.params.id;

  // Check if the id is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ Status: false, Error: "Invalid ID format" });
  }

  const sql = "SELECT * FROM employee WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching employee:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    // Check if no result was returned
    if (result.length === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }

    console.log("Employee fetched:", result);
    return res.status(200).json({ Status: true, Result: result });
  });
});

// Edit employee route with optional photo update
router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;

  // Validate that 'id' is present
  if (!id) {
    return res
      .status(400)
      .json({ Status: false, Error: "Employee ID is required" });
  }

  // Extract and validate input data
  const {
    name,
    dob,
    gender,
    phone,
    email,
    address,
    qualification,
    specialization,
    institution,
    graduationYear,
    employeeId,
    designation,
    category_name,
    joiningDate,
    salary,
    workMode,
    workLocation,
    accountHolderName,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    accountType,
  } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ Status: false, Error: "Employee name is required" });
  }

  const sql = `
    UPDATE employee
    SET 
      name = ?, 
      dob = ?, 
      gender = ?, 
      phone = ?, 
      email = ?, 
      address = ?, 
      qualification = ?, 
      specialization = ?, 
      institution = ?, 
      graduationYear = ?, 
      employeeId = ?, 
      designation = ?, 
      category_name = ?, 
      joiningDate = ?, 
      salary = ?, 
      workMode = ?,  
      workLocation = ?, 
      accountHolderName = ?, 
      bankName = ?, 
      branchName = ?, 
      accountNumber = ?, 
      ifscCode = ?, 
      accountType = ? 
    WHERE id = ?
  `;

  const values = [
    name,
    dob,
    gender,
    phone,
    email,
    address,
    qualification,
    specialization,
    institution,
    graduationYear,
    employeeId,
    designation,
    category_name,
    joiningDate,
    salary,
    workMode,
    workLocation,
    accountHolderName,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    accountType,
  ];

  // Execute the SQL query
  con.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }

    console.log("Employee updated:", result);
    return res.status(200).json({
      Status: true,
      Message: "Employee updated successfully",
      Result: result,
    });
  });
});

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  console.log("Delete request for employee ID:", id); // Debugging log
  const sql = "DELETE FROM employee WHERE id=?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }

    console.log("Employee deleted successfully:", result);
    return res.status(200).json({
      Status: true,
      Message: "Employee deleted successfully",
      Result: result,
    });
  });
});

router.get("/admin_count", (req, res) => {
  const sql = "select count(id) as admin from admin";
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }

    console.log(result);
    return res.status(200).json({ Status: true, Result: result });
  });
});

router.get("/employee_count", (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }

    console.log(result);
    return res.status(200).json({ Status: true, Result: result });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});


export { router as adminRouter };
