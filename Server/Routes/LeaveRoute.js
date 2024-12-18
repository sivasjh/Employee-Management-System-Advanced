import express from "express";
import con from "../utils/db.js";

const leaveRouter = express.Router();

// Apply for leave
leaveRouter.post("/apply", (req, res) => {
    const { employeeId, leave_type, start_date, end_date, note } = req.body;
    const query = `
        INSERT INTO leave_requests (employeeId, leave_type, start_date, end_date, note)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [employeeId, leave_type, start_date, end_date, note];
    con.query(query, params, (err, result) => {
        if (err) {
            console.error("Error applying for leave:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // Send notification
        const notificationQuery = `
            INSERT INTO notifications (employeeId, message)
            VALUES (?, ?)
        `;
        const notificationMessage = `${employeeId} applied for leave`;
        con.query(notificationQuery, [employeeId, notificationMessage], (err, result) => {
            if (err) {
                console.error("Error inserting notification:", err);
            }
        });

        res.status(200).json({ message: "Leave request submitted successfully" });
    });
});

// Approve or reject leave
leaveRouter.put("/update", (req, res) => {
    const { id, status, employeeId } = req.body;
    const query = `
        UPDATE leave_requests
        SET status = ?
        WHERE id = ?
    `;
    con.query(query, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating leave status:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // Send notification to the employee
        const notificationQuery = `
            INSERT INTO notifications (employeeId, message)
            VALUES (?, ?)
        `;
        const notificationMessage = `Your leave request has been ${status}`;
        con.query(notificationQuery, [employeeId, notificationMessage], (err, result) => {
            if (err) {
                console.error("Error notifying employee:", err);
            }
        });

        res.status(200).json({ message: "Leave status updated successfully" });
    });
});

// Get leave requests for the past 24 hours
leaveRouter.get("/list", (req, res) => {
    const query = `
        SELECT lr.*, e.name 
        FROM leave_requests lr
        JOIN employee e ON lr.employeeId = e.employeeId
        WHERE lr.created_at >= NOW() - INTERVAL 1 DAY
    `;
    con.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching leave requests:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(result);
    });
});

// Leave counts for dashboard
leaveRouter.get("/counts", (req, res) => {
    const query = `
        SELECT 
            SUM(status = 'Approved') AS approved,
            SUM(status = 'Rejected') AS rejected
        FROM leave_requests
    `;
    con.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching leave counts:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(result[0]);
    });
});

// Get notifications for an employee
leaveRouter.get("/notifications", (req, res) => {
    const { employeeId } = req.query;
    const query = `
        SELECT * FROM notifications WHERE employeeId = ? ORDER BY created_at DESC
    `;
    con.query(query, [employeeId], (err, result) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(result);
    });
});

export { leaveRouter };
