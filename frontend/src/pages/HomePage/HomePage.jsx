import React from 'react'
import Navbar from '../../components/navbar/Navbars'
import { useEffect, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import Attendance from '../../components/AttendanceMark/Attendance'
import Profile from '../Profile/Profile'

function HomePage() {
  const navigate = useNavigate()
 

  useEffect(() => {
    const LogedIn = localStorage.getItem('accessToken')
    if (!LogedIn) {
      navigate('/log-in')
    }
  }, [navigate])

  return (
    <>
      <Navbar />
      <Profile/>
  
    </>
  )
}

export default HomePage
