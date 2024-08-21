import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Sidebar/Navbar'
import styles from './leave.module.css'
import {format, parseISO } from 'date-fns'

const LeavePage = () => {
  const [allLeaveRequests, setLeaveRequests] = useState([])
  const [users, setUsers] = useState([]);

  console.log(users)

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/get-all', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllLeaveReq = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/request/all-leaves', {
        method: "GET"
      })
      const result = await response.json()
      const pendingLeaves = result.filter(item => item.status === 'Pending');
      setLeaveRequests(pendingLeaves);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllLeaveReq();
    fetchUsers();
  }, []);

  // const findUserName = (userId) => {
  //   const user = users.find((user) => user.id === userId);
  //   return user ? user.name : 'User not found';
  // };


  const updateLeaveReq = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/leave-req/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchAllLeaveReq();
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  }


  const handleApprove = (id) => {
    const updatedData = { status: 'Approved' };
    updateLeaveReq(id, updatedData);
  };

  const handleReject = (id) => {
    const updatedData = { status: 'Rejected' };
    updateLeaveReq(id, updatedData);
  };

  return (
    <>
      <Navbar />
      {allLeaveRequests.length > 0 ? (
        <section className={styles.leave_main_container}>
          <h1>Leave Requests</h1>
          <div className={styles.leave_req_grid}>
            {allLeaveRequests.map(request => (
              <div key={request._id} className={styles.card}>
                <h1>Name: {
                  users.length > 0
                    ? (users.find(user => user._id === request.userId)?.name || 'loading')
                    : 'loading'
                }</h1>
                <p>Status: {request.status}</p>
                <p>Date: {format(parseISO(request.startDate), 'dd-MM-yy')}</p>
                <p>Date: {format(parseISO(request.endDate), 'dd-MM-yy')}</p>
                <p>Reason: {request.reason}</p>
                <button onClick={() => handleApprove(request._id)} className={styles.btn1}>Approve</button>
                <button onClick={() => handleReject(request._id)} className={styles.btn2}>Reject</button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className={styles.no_req}>No requests for today</p>
      )}
    </>
  )
}

export default LeavePage
