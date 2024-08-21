import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link, Navigate
} from "react-router-dom";
import Signup from './pages/AuthPage/Signup';
import LoginPage from './pages/AuthPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import AccountEdit from './pages/AccountEditPage/AccountEdit'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar/Navbars'
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Dashboard from './pages/DashboardPage/Dashboard';
import LeavePage from './pages/LeaveReqPage/LeavePage';
import EditProfile from './pages/ProfileEditPage/EditProfile';
import LeaveEdit from './pages/LeaveEditPage/LeaveEdit';
import AttendanceEdit from './pages/AttendanceEditPage/AttendanceEdit';
import Report from './pages/ReportPage/Report';
import DailyReport from './pages/ReportPage/DailyReport';

const App = () => {

  const { user } = useContext(UserContext)

  const isLoggedIn = localStorage.getItem('accessToken')
  const isAdmin = user?.isAdmin

  return (
    <Router>
      {/* <Navbar/> */}
      <Toaster />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/log-in' element={<LoginPage />} />
        <Route path='/edit-info/:id' element={<AccountEdit />} />
        <Route path='/dashboard' element={isAdmin ? < Dashboard /> : <Navigate to={'/'} />} />
        <Route path='/leave-req' element={isAdmin ? < LeavePage /> : <Navigate to={'/'} />} />
        <Route path='/edit-profile/:id' element={isAdmin ? < EditProfile /> : <Navigate to={'/'} />} />
        <Route path='/edit-leave/:id' element={isAdmin ? < LeaveEdit /> : <Navigate to={'/'} />} />
        <Route path='/edit-attendance/:id' element={isAdmin ? <AttendanceEdit /> : <Navigate to={'/'} />} />
        <Route path='/generate-report/:id' element={isAdmin ? <Report /> : <Navigate to={'/'} />} />
        <Route path='/daily-report' element={isAdmin ? <DailyReport /> : <Navigate to={'/'} />} />
        {/* <Route path='/edit-attendance/:id' element={<AttendanceEdit />}  /> */}

      </Routes>
    </Router>
  )
}

export default App
