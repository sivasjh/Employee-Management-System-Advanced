import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../Styles/AttendanceStatus.module.css"
function AttendanceStatus() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/attendance/status")
      .then(response => {
        setAttendance(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className={styles.attendanceWrapper}>
      <div className={styles.attendanceHeader}>
        <h2 className={styles.attendanceTitle}>Employee Attendance Status</h2>
      </div>
      <div className={styles.attendanceTableWrapper}>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr
                key={att.employeeId}
                className={
                  att.status.toLowerCase() === "present"
                    ? styles.statusPresent
                    : att.status.toLowerCase() === "absent"
                    ? styles.statusAbsent
                    : styles.statusHalfDay
                }
              >
                <td>{att.name}</td>
                <td>{att.employeeId}</td>
                <td className={styles.statusCell}>{att.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

export default AttendanceStatus;
