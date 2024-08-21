import React, { useEffect, useState } from 'react'
import styles from './leave.edit.module.css'
import Navbar from '../../components/Sidebar/Navbar'
import { useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { useNavigate } from 'react-router-dom'
const LeaveEdit = () => {

  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState()
  const navigate = useNavigate()

  const { id } = useParams()


  const fetchLeaveData = async (req, res) => {
    try {
      const response = await fetch(`http://localhost:3000/api/request/find-leaves/${id}`, {
        method: "GET"
      })
      const result = await response.json()
      setStartDate(result.startDate)
      setEndDate(result.endDate)
      setReason(result.reason)
      setStatus(result.status)
      // console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLeaveData();
  }, []);



  const handleLeaveEdit = async (req, res) => {

    const data = {
      endDate: endDate,
      reason: reason,
      status: status
    }

    try {
      const response = await fetch(`http://localhost:3000/api/leave-req/update/${id}`, {
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
      alert('Leave Updated Successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };


  return (
    <>
      <Navbar />
      <div className={styles.leave_edit_main_container}>
        <h2>Update Leave Request</h2>
        <div className={styles.update_leave}>
          <div className={styles.leave_Request_body}>
            <div className={styles.leave_dates}>
              <label htmlFor="text">Date</label>
              {/* <input type="text" value={Date.now()} name="" id="" readOnly /> */}
              {/* <label htmlFor="date">Start Date</label> */}
              <input type="date"  value={startDate ? format(parseISO(startDate), 'yyyy-MM-dd') : ''} onChange={(e) => setStartDate(e.target.value)} />
              <label htmlFor="date">End Date</label>
              <input type="date" value={endDate ? format(parseISO(endDate), 'yyyy-MM-dd') : ''} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className={styles.leave_reason}>
              <label htmlFor="textarea">Reason</label>
              <textarea name="" id="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)} >
              </textarea>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select status</option>
                <option value="Approved">Approve</option>
                <option value="Rejected">Reject</option>
              </select>
              {
                <button onClick={handleLeaveEdit}>Update</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeaveEdit
