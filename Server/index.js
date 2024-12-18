import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import con from "./utils/db.js";
import { leaveRouter } from "./Routes/LeaveRoute.js";
import PDFDocument from "pdfkit";
import fs from "fs"; // Required for file system operations
const app = express();

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", adminRouter);
app.use("/employee", EmployeeRouter);
app.use("/leave", leaveRouter);
app.use("/pdfs", express.static("pdfs"));  // For serving PDFs
app.use("/uploads", express.static("uploads"));

// Handle preflight requests
app.options("*", cors()); // Optional, handles CORS preflight for all routes

// Token verification middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "Wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: "Not authenticated" });
  }
};

// Utility function for calculating working days in a month
function calculateWorkingDays(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}1

// Mark Attendance
app.post("/attendance/mark", verifyUser, (req, res) => {
  const { employeeId, status, checkin_time, checkout_time, remarks } = req.body;

  if (!employeeId || !status) {
    return res.status(400).json({ message: "Employee ID and status are required" });
  }

  const query = `
    INSERT INTO attendance (employeeId, status, checkin_time, checkout_time, remarks, date)
    VALUES (?, ?, ?, ?, ?, CURDATE())
  `;
  const queryParams = [
    employeeId,
    status,
    status === "Absent" ? null : checkin_time,
    status === "Absent" ? null : checkout_time,
    remarks,
  ];

  con.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error marking attendance:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Update total_present_days and total_leaves_taken in payment_slip
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const updateSlipQuery = `
      UPDATE payment_slip
      SET 
        total_present_days = (
          SELECT COUNT(*) 
          FROM attendance 
          WHERE employeeId = ? 
            AND status = 'Present' 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
        ),
        total_leaves_taken = (
          SELECT COUNT(*) 
          FROM attendance 
          WHERE employeeId = ? 
            AND status = 'Absent' 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
        )
      WHERE employeeId = ? 
        AND month = ?
    `;
    const formattedMonth = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    con.query(updateSlipQuery, [employeeId, currentMonth, currentYear, employeeId, currentMonth, currentYear, employeeId, formattedMonth], (err) => {
      if (err) {
        console.error("Error updating payment slip:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.status(200).json({
        message: "Attendance marked successfully and payment slip updated",
        attendanceId: result.insertId,
      });
    });
  });
});


// Get Attendance Counts Route
app.get("/attendance/counts", (req, res) => {
  const query = `
    SELECT 
      SUM(status = 'Present') AS present,
      SUM(status = 'Absent') AS absent,
      SUM(status = 'Half-day') AS halfDay
    FROM attendance
    WHERE date = CURDATE()
  `;

  con.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching attendance counts:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(result[0]);
  });
});

// Get Attendance Status for Employee
app.get("/attendance/status", verifyUser, (req, res) => {
  const query = `
    SELECT 
      e.name, 
      a.employeeId, 
      a.status 
    FROM attendance a
    JOIN employee e ON a.employeeId = e.employeeId
    WHERE a.date = CURDATE()
  `;

  con.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching attendance status:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(result);
  });
});


app.post('/payment/generate-payment-slip', (req, res) => {
  const { employeeId, month, year } = req.body;

  if (!employeeId || !month || !year) {
    return res.status(400).json({ message: 'Missing required fields: employeeId, month, or year.' });
  }

  const formattedMonth = `${year}-${String(month).padStart(2, '0')}`;

  // Fetch employee details
  con.query('SELECT * FROM employee WHERE employeeId = ?', [employeeId], (err, employeeResults) => {
    if (err || employeeResults.length === 0) {
      return res.status(500).json({ message: 'Employee not found or internal error.' });
    }

    const employee = employeeResults[0];
    const totalWorkingDays = calculateWorkingDays(month, year);

    // Fetch attendance details
    const attendanceQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'Present' THEN 1 END) AS total_present_days,
        COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS total_absent_days
      FROM attendance
      WHERE employeeId = ? AND MONTH(date) = ? AND YEAR(date) = ?
    `;
    con.query(attendanceQuery, [employeeId, month, year], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching attendance data.' });
      }

      const { total_present_days, total_absent_days } = result[0];
      const dailyWage = employee.salary / totalWorkingDays;
      const payableSalary = dailyWage * total_present_days;

      // Generate PDF
      const doc = new PDFDocument({ margin: 50 });
      const pdfPath = `./pdfs/payment_slip_${employeeId}_${month}_${year}.pdf`;
      const pdfStream = fs.createWriteStream(pdfPath);
      doc.pipe(pdfStream);

      doc.font('Helvetica-Bold').fontSize(20).text('Salary Payment Slip', { align: 'center' });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12).text(`Employee ID: ${employee.employeeId}`);
      doc.text(`Name: ${employee.name}`);
      doc.text(`Department: ${employee.category_name}`);
      doc.text(`Month: ${formattedMonth}`);
      doc.moveDown();
      doc.text(`Total Working Days: ${totalWorkingDays}`);
      doc.text(`Present Days: ${total_present_days}`);
      doc.text(`Payable Salary: ${payableSalary.toFixed(2)}`);
      doc.end();

      pdfStream.on('finish', () => {
        res.status(200).json({
          message: 'Payment slip generated successfully.',
          pdfPath: `/pdfs/payment_slip_${employeeId}_${month}_${year}.pdf`,
        });
      });
    });
  });
});





// Verify Route for User Authentication
app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

// Start the server
app.listen(3001, () => {
  console.log("The port is running on port 3001");
});
