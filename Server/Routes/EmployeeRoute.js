import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ Status: false, error: "Unauthorized" });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ Status: false, error: "Invalid token" });
    }
    req.user = decoded; // Attach decoded token to req
    next();
  });
};

// Employee login route
router.post("/employee_login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM employee WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ loginStatus: false, error: err.message });

    if (result.length > 0) {
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ loginStatus: false, error: err.message });

        if (isMatch) {
          const token = jwt.sign(
            { role: "employee", email: user.email, id: user.id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );

          res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
          return res.json({ loginStatus: true, id: user.id });
        } else {
          return res.json({ loginStatus: false, error: "Incorrect password" });
        }
      });
    } else {
      return res.json({ loginStatus: false, error: "Incorrect email" });
    }
  });
});

// Protected employee detail route

router.get("/list", verifyToken, (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ Status: false, error: err.message });
    }
    return res.json(results); // Return the list of employees
  });
});

router.get("/detail/:id", (req, res) => {
  const token = req.cookies.token; // Read token from cookies
  if (!token) {
    return res.status(403).json({ Status: false, error: "Access denied. No token provided." });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ Status: false, error: "Invalid or expired token." });
    }

    const requestedId = req.params.id;
    const loggedInUserId = decoded.id; // Extracted from token

    // Check if the requested ID matches the logged-in user's ID
    if (requestedId != loggedInUserId) {
      return res.status(403).json({ Status: false, error: "Unauthorized access to this resource." });
    }

    // Query the database for employee details
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [requestedId], (err, result) => {
      if (err) return res.status(500).json({ Status: false, error: err.message });
      if (result.length === 0) {
        return res.status(404).json({ Status: false, error: "Employee not found." });
      }
      return res.json(result[0]); // Return employee data
    });
  });
});


router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as EmployeeRouter };
