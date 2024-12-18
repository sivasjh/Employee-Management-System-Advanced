import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from"../Styles/PaymentSlip.module.css"
function PaymentSlip() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/employee/list')
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching employee data:', error));
  }, []);

  const handleGenerateSlip = (employeeId) => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();

    axios
      .post('http://localhost:3001/payment/generate-payment-slip', { employeeId, month, year })
      .then((response) => {
        const pdfUrl = `http://localhost:3001${response.data.pdfPath}`;
        window.open(pdfUrl, '_blank');
      })
      .catch((error) => console.error('Error generating payment slip:', error));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Generate Payment Slips</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Download Slip</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeId}>
              <td>{emp.name}</td>
              <td>{emp.employeeId}</td>
              <td>{emp.category_name}</td>
              <td>
                <button onClick={() => handleGenerateSlip(emp.employeeId)}>
                  Generate and Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentSlip;