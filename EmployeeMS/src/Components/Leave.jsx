import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Styles/Leave.module.css";

function Leave() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    

    useEffect(() => {
        axios.get("http://localhost:3001/leave/list")
            .then(response => {
                setLeaveRequests(response.data);
                // Check if there are any new leave requests
            })
            .catch(err => console.error(err));
    }, []);

    const handleStatusUpdate = (id, status, employeeId) => {
        axios.put("http://localhost:3001/leave/update", { id, status })
            .then(response => {
                alert(response.data.message);
                setLeaveRequests(prev => 
                    prev.map(req => req.id === id ? { ...req, status } : req)
                );

                // Notify employee about approval/rejection
                axios.post("http://localhost:3001/leave/notify", { employeeId, status })
                    .then(notificationResponse => {
                        alert(`Your leave is ${status}`);
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className={styles.container}>
            <h3>Leave Requests (Last 24 Hours)</h3>
           
            {leaveRequests.length === 0 ? (
                <p>No leave requests in the last 24 hours.</p>
            ) : (
                leaveRequests.map(req => (
                    <div key={req.id} className={styles.leaveCard}>
                        <span className={`${styles.status} ${styles[req.status]}`}>
                            {req.status}
                        </span>
                        <p><strong>{req.name}</strong> ({req.leave_type})</p>
                        <p>From: {req.start_date} To: {req.end_date}</p>
                        <button onClick={() => handleStatusUpdate(req.id, "Approved", req.employeeId)}>
                            Approve
                        </button>
                        <button onClick={() => handleStatusUpdate(req.id, "Rejected", req.employeeId)}>
                            Reject
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Leave;
