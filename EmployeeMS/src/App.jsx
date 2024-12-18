import React from 'react'
import Login from './Components/Login'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from './Components/Dashboard'
import Employee from './Components/Employee'
import Home from './Components/Home'
import Category from './Components/Category'
import AddCategory from './Components/AddCategory'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import Employeelogin from './Components/Employeelogin'
import EmployeeDetail from './Components/EmployeeDetail'
import PrivateRoutes from './Components/PrivateRoutes'
import AttendanceStatus from './Components/AttendanceStatus'
import Leave from './Components/Leave'
import PaymentSlip from './Components/PaymentSlip'
function App() {


  return (

    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Start />} />
    
    {/* Admin Login */}
    <Route path="/adminlogin" element={<Login />} />

    {/* Employee Login */}
    <Route path="/employee_login" element={<Employeelogin />} />

    {/* Employee Routes */}
    <Route
      path="/employee_detail/:id"
      element={
        <PrivateRoutes role="employee">
          <EmployeeDetail />
        </PrivateRoutes>
      }
    />

    {/* Admin Routes */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoutes role="admin">
          <Dashboard />
        </PrivateRoutes>
      }
    >
      <Route path="" element={<Home />} />
      <Route path="employees" element={<Employee />} />
      <Route path="category" element={<Category />} />
      <Route path="attendance" element={<AttendanceStatus />} />
      <Route path="leave" element={<Leave />} />
      <Route path="payment" element={<PaymentSlip />} />
      <Route path="add_category" element={<AddCategory />} />
      <Route path="add_employee" element={<AddEmployee />} />
      <Route path="edit_employee/:id" element={<EditEmployee />} />
    </Route>
  </Routes>
</BrowserRouter>

    
  )
}

export default App