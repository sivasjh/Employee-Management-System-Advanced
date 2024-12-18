import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styles from '../Styles/EmployeeDetail.module.css';
import {useNavigate} from "react-router-dom"


function EmployeeDetail() {
  const [employee, setEmployee] = useState({});
  const [status, setStatus] = useState("Present");
  const [remarks, setRemarks] = useState("");
  const [checkinTime, setCheckinTime] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [leaveType, setLeaveType] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [note,setNote]=useState("")
const [notifications, setNotifications] = useState([]);
  const { id } = useParams();
  axios.defaults.withCredentials = true;
const navigate = useNavigate()
  useEffect(() => {
    axios
    .get(`http://localhost:3001/employee/detail/${id}`, { withCredentials: true })
    .then((result) => {
      setEmployee(result.data);
    })
    .catch((err) => {
      console.error(err.response?.data?.error || "An error occurred");
      alert(err.response?.data?.error || "Unauthorized access.");
    });
      axios
            .get(`http://localhost:3001/leave/notifications?employeeId=${id}`)
            .then(response => setNotifications(response.data))
            .catch(err => console.log(err));

  }, [id]);

  const handleLogout=()=>{
    axios.get("http://localhost:3001/employee/logout")
    .then(result=>{
      if(result.data.Status){
        localStorage.removeItem("valid")
    navigate("/")
      }
    }).catch(err=>console.log(err))
    }

    const handleAttendanceSubmit = () => {
      const attendanceData = {
        employeeId: employee.employeeId,
        status,
        remarks,
        checkin_time: checkinTime,
        checkout_time: checkoutTime,
        date: new Date().toISOString().split('T')[0],
      };
    
      console.log("Attendance Data:", attendanceData);  // Debugging line
    
      axios.post("http://localhost:3001/attendance/mark", attendanceData)
        .then(response => {
          if (response.data.message.includes("Attendance marked successfully")) {
            alert("Attendance marked successfully");
          } else {
            alert("Failed to mark attendance");
          }
          
          }
        )
        .catch(err => console.log(err));
  };
  const handleLeaveApply = () => {
    const leaveData = {
        employeeId: employee.employeeId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        note,
    };

    axios.post("http://localhost:3001/leave/apply", leaveData)
        .then(response => {
            alert(response.data.message);
        })
        .catch(err => console.error(err));
};

const handleDownloadSlip = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // Months are 0-indexed
  const year = currentDate.getFullYear();

  axios.post('http://localhost:3001/payment/generate-payment-slip', { 
      employeeId: employee.employeeId, 
      month, 
      year 
    })
    .then((response) => {
      const pdfUrl = `http://localhost:3001${response.data.pdfPath}`;
      window.open(pdfUrl, '_blank');
    })
    .catch((error) => console.error(error));
};



  return (
    <div className={styles.employeeDetail}>
      <header className={styles.employeeHeader}>
        <h1>Employee Profile</h1>
        <p>Welcome {employee.name}</p>
      </header>
      <div className={styles.notifications}>
                <h4>Notifications:</h4>
                <ul>
                    {notifications.map((notif, index) => (
                        <li key={index}>{notif.message}</li>
                    ))}
                </ul>
            </div>

      <div className={styles.employeeCard}>
        <div className={styles.photoSection}>
          {employee.photo ? (
            <img
              src={`http://localhost:3001/${employee.photo}`}
              alt="Employee"
              className={styles.employeePhoto}
            />
          ) : (
            <div className={styles.placeholderPhoto}>No Photo</div>
          )}
        </div>
        <div className={styles.employeeInfo}>
          <h2>{employee.name}</h2>
          <p><strong>Employee ID:</strong> {employee.employeeId}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phone}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Department:</strong> {employee.category_name}</p>
          <p><strong>Joining Date:</strong> {employee.joiningDate}</p>
          <p><strong>Salary:</strong> ${employee.salary}</p>
          <p><strong>Work Mode:</strong> {employee.workMode}</p>
          <p><strong>Work Location:</strong> {employee.workLocation}</p>
          <p><strong>Account Holder:</strong> {employee.accountHolderName}</p>
          <p><strong>Bank:</strong> {employee.bankName}</p>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Half-day">Half-day</option>
        </select>
        <div>
          <label>Check-in Time: </label>
          <input
            type="time"
            value={checkinTime}
            onChange={(e) => setCheckinTime(e.target.value)}
            disabled={status === "Absent"}  // Disable check-in time if Absent
          />
        </div>
        <div>
          <label>Check-out Time: </label>
          <input
            type="time"
            value={checkoutTime}
            onChange={(e) => setCheckoutTime(e.target.value)}
            disabled={status === "Absent"}  // Disable check-out time if Absent
          />
        </div>
        <div>
          <label>Remarks: </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <button onClick={handleAttendanceSubmit}>Mark</button>
      </div>
      <div className="leave-application">
    <h3>Apply for Leave</h3>
    <label>Leave Type:</label>
    <input 
        type="text" 
        value={leaveType} 
        onChange={(e) => setLeaveType(e.target.value)} 
    />
    <label>Start Date:</label>
    <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
    />
    <label>End Date:</label>
    <input 
        type="date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
    />
    <label>Note :</label>
    <textarea 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
    />
    <button onClick={handleLeaveApply}>Apply Leave</button>
</div>

<div className={styles.paymentSlipSection}>
        <h3>Download Your Payment Slip</h3>
        <button onClick={handleDownloadSlip}>Download</button>
      </div>

<div className={styles.actionButtons}>
<button className={`${styles.btn} ${styles.logoutBtn}`} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>

    
  );
}

export default EmployeeDetail;