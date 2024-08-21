import React, { useEffect, useState } from 'react'
import styles from './attendance.edit.module.css'
import Navbar from '../../components/Sidebar/Navbar'
import { useNavigate, useParams } from 'react-router-dom'

const AttendanceEdit = () => {
  const { id } = useParams()
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')

  const navigate = useNavigate()
  const fetchAttendanceById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/attendance/getbyid/${id}`, {
        method: "GET"
      })
      const result = await response.json()
      setStatus(result.status)
      setDate(result.date)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAttendanceById()
  }, [])

  const updateAttendance = async () => {

    const data = {
      status: status
    }
    try {
      const response = await fetch(`http://localhost:3000/api/attendance/updatebyid/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Attendance Updated Successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };



  return (
    <>
      <Navbar />
      <section className={styles.attendance_edit_main_page}>
        <h1>Update Attendance</h1>
        <div className={styles.edit_part}>
          <div className={styles.input_part}>
            <label htmlFor="">Date</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {/* <div className={styles.input_part}>
            <label htmlFor="">Name</label>
            <input type="text" />
          </div> */}
          <label htmlFor="">Select Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select status</option>
            <option value="Absent">Absent</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
          </select>
          {
            <button onClick={updateAttendance} >Update</button>
          }
        </div>
      </section>
    </>
  )
}

export default AttendanceEdit
