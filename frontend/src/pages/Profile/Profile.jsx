import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styles from './profile.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

import { CircleCheckBig, MessageCircleMore, Heart, SquarePen, Trash2 } from 'lucide-react'


const Profile = () => {
    const [activeSection, setActiveSection] = useState('attendance');
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const [status, setStatus] = useState("")
    const [attendance, setAttendance] = useState([])
    const [leave, setLeave] = useState('')
    const [userAttendances, setUserAttendences] = useState([])
    const [studentLeaves, setStudentLeaves] = useState([])


    // ------------ the leave request states-----------
    // const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')


    // ------------------------ THE FETCHING DATA FUNCTIONS FROM THE BACKEND_----------

    // 1__ FETCHING ATTENDANCE

    const FetchAttendance = async () => {

        try {

            const response = await fetch('http://localhost:3000/api/show/all-attendance', {
                method: "GET"
            });
            const result = await response.json();
            const userAttendances = result?.filter(item => item.userId === user._id);
            console.log(userAttendances);
            setUserAttendences(userAttendances);

            const todayDate = format(new Date(), 'yyyy-MM-dd');


            const todayAttendance = result.find(item => {
                const itemDate = format(parseISO(item.date), 'yyyy-MM-dd');
                return itemDate === todayDate && item.userId === user._id;
            });
            setAttendance(todayAttendance)

        } catch (error) {
            console.log(error);
        }
    };

    // 2____ FETHCING LEAVES 

    const FetchLeaveRequests = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/request/all-leaves', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const result = await response.json();
                const totalLeaves = result?.filter(item => item.userId === user._id)
                setStudentLeaves(totalLeaves)

                const todayDate = format(new Date(), 'yyyy-MM-dd');
                const todayLeave = result.find(item => {
                    const leaveStartDate = format(parseISO(item.startDate), 'yyyy-MM-dd');
                    const leaveEndDate = format(parseISO(item.endDate), 'yyyy-MM-dd');
                    return todayDate >= leaveStartDate && todayDate <= leaveEndDate && item.userId.toString() === user._id.toString();
                });

                setLeave(todayLeave || null);
            } else {
                console.error('Failed to fetch leave requests. Response not okay.');
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    };


    useEffect(() => {
        if (user && user._id) {
            FetchAttendance();
            FetchLeaveRequests();
        } else {
            console.log('User is not available.');
        }
    }, [user]);

    const combinedData = [
        ...userAttendances.map(attendance => ({ ...attendance, type: 'attendance' })),
        ...studentLeaves.map(leave => ({ ...leave, type: 'leave' }))
    ];


    // ------------------ Handling the section change method

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    if (!user) { return <p>Loading...</p> }

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });


    const handleLogout = () => {

        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('accessToken');
            navigate('/log-in');
        }
    }

    const { profile, name, email, address, dob } = user

    // ------------- THE ADDING FUNCTIONS OF DATA TO THE BACKEND_-------------

    // 1 ADDING ATTENDACE TO THE BACKEDN

    const HandleMarkAttendance = async () => {
        const currentDate = new Date().toISOString();

        const data = {
            userId: user._id,
            status: status,
            date: currentDate
        };

        try {
            const fetchResponse = await fetch('http://localhost:3000/api/show/all-attendance', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (fetchResponse.ok) {
                const attendanceRecords = await fetchResponse.json();
                const todayAttendance = attendanceRecords.find(item => {
                    const itemDate = format(parseISO(item.date), 'yyyy-MM-dd');
                    const todayDate = format(new Date(), 'yyyy-MM-dd');
                    return itemDate === todayDate && item.userId.toString() === user._id.toString();
                });

                if (todayAttendance) {
                    console.log('Attendance for today is already marked');
                    alert('Attendance for today is already marked');
                    return;
                }

                const markResponse = await fetch('http://localhost:3000/api/attendance/mark', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (markResponse.ok) {
                    const result = await markResponse.json();
                    console.log('Attendance marked successfully:', result);
                    setActiveSection('attendance')
                    window.location.reload()
                } else {
                    console.error('Failed to mark attendance. Response not okay.');
                }
            } else {
                console.error('Failed to fetch attendance records. Response not okay.');
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    };

    // 2 ADDING LEAVE REQUEST 

    const HandleLeaveRequest = async () => {
        const currentDate = new Date().toISOString();

        const data = {
            userId: user._id,
            endDate: Date.now,
            reason,
            status: 'Pending'
        };

        try {
            const fetchPreviousLeaves = await fetch('http://localhost:3000/api/request/all-leaves', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (fetchPreviousLeaves.ok) {
                const previousLeavesRecord = await fetchPreviousLeaves.json();
                const todayDate = format(new Date(), 'yyyy-MM-dd');

                const hasRequestedLeave = previousLeavesRecord.find(item => {
                    const leaveStartDate = format(parseISO(item.startDate), 'yyyy-MM-dd');
                    const leaveEndDate = format(parseISO(item.endDate), 'yyyy-MM-dd');
                    return todayDate >= leaveStartDate && todayDate <= leaveEndDate && item.userId.toString() === user._id.toString();
                });

                if (hasRequestedLeave) {
                    alert('Leave for today has already been requested.');
                } else {
                    const requestResponse = await fetch('http://localhost:3000/api/request/leave', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    if (requestResponse.ok) {
                        const result = await requestResponse.json();
                        console.log('Leave requested successfully:', result);
                        window.location.reload()
                        setActiveSection('attendance')
                    } else {
                        console.error('Failed to request leave. Response not okay.');
                    }
                }
            } else {
                console.error('Failed to fetch previous leave records. Response not okay.');
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    };

    // 3 DELETING THE ABOUT INFO || DELETING ACCOUNT

    const deleteAccount = async () => {

        const isConfirmed = window.confirm("Are you sure you want to delete your account.");

        if (isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/auth/delete/${user._id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    localStorage.removeItem('accessToken')
                    navigate('/log-in')
                    alert("Your account has been successfully deleted.");

                } else {
                    alert("There was an error deleting your account. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occurred. Please try again later.");
            }
        } else {
            alert("Account deletion canceled.");
        }
    }


    return (
        <section className={styles.profile_page}>
            <div className={styles.profile_main}>
                <div className={styles.profile_top}>
                    <div className={styles.profile_top_img_side}>
                        <img src={profile} alt="Profile" />
                    </div>
                    <div className={styles.profile_top_info_side}>
                        <div className={styles.name_part}>
                            <h1>Welcome {name}</h1>
                        </div>
                        <div className={styles.links_part}>
                            <p
                                className={activeSection === 'about' ? styles.active : ''}
                                onClick={() => handleSectionChange('about')}
                            >
                                About
                            </p>
                            <p
                                className={activeSection === 'attendance' ? styles.active : ''}
                                onClick={() => handleSectionChange('attendance')}
                            >
                                Attendance
                            </p>
                            <p
                                className={activeSection === 'records' ? styles.active : ''}
                                onClick={() => handleSectionChange('records')}

                            >
                                All records
                            </p>
                            <p
                                className={activeSection === 'Leave' ? styles.active : ''}
                                onClick={() => handleSectionChange('Leave')}

                            >
                                Leave
                            </p>
                            <p>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        color: 'red',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Logout
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.profile_bottom}>
                    {activeSection === 'about' && (
                        <div className={styles.profile_about}>
                            <div className={styles.info_style_btns}>
                                <Link to={`/edit-info/${user._id}`}><SquarePen strokeWidth={0.8} /></Link>
                                <button onClick={deleteAccount}><Trash2 strokeWidth={0.8} /></button>
                            </div>
                            <h1>About</h1>
                            <div className={styles.profile_main_info}>
                                <div className={styles.info_left}>
                                    <div className={styles.info_style}>
                                        <h4>Name</h4>
                                        <p>: {name}</p>
                                    </div>
                                    <div className={styles.info_style}>
                                        <h4>DOB</h4>
                                        <p>{format(parseISO(dob), 'yyyy-MM-dd')}</p>

                                    </div>
                                    <div className={styles.info_style}>
                                        <h4>Email</h4>
                                        <p>: {email}</p>
                                    </div>
                                    <div className={styles.info_style}>
                                        <h4>Address</h4>
                                        <p>: {address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'attendance' && (
                        <div className={styles.profile_bottom_left}>
                            <h1>Mark Attendance</h1>
                            <p>Date: {currentDate}</p>
                            {leave ? (
                                `Leave for today is requested. Status: ${leave.status}`
                            ) : (
                                attendance ? (
                                    `Attendance for Today is Marked. You are ${attendance.status}`
                                ) : (
                                    <div className={styles.profile_post_grid}>
                                        <label htmlFor="name">Name</label>
                                        <input type="text" value={name} readOnly />
                                        <input type="text" value={currentDate} readOnly />
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

                                        <button className={styles} onClick={HandleMarkAttendance} disabled={!!attendance || !!leave}>Mark</button>
                                        <button onClick={() => setActiveSection('Leave')}>Leave</button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                    {activeSection == 'records' && (
                        <div className={styles.following_main}>
                            <h1>Attendence Record</h1>
                            <div className={styles.record_table}>
                                <h3>Name: {user.name}</h3>
                                <table border={1}>
                                    <thead>
                                        <th>No</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </thead>
                                    {combinedData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td> 
                                            <td>{format(parseISO(item.date || item.startDate), 'yyyy-MM-dd')}</td>
                                            <td>{item.status === 'Pending' ||   item.status === 'Approved'   ||   item.status === 'Rejected'  ? 'Leave Request' : "Attendence"}</td>
                                            <td>{item.status}</td> 
                                        </tr>
                                    ))}

                                </table>
                            </div>
                        </div>
                    )}
                    {activeSection == 'Leave' && (
                        <div className={styles.leave_main}>
                            <h1>Leave Request</h1>
                            <div className={styles.leave_Request_body}>
                                <div className={styles.leave_dates}>
                                    <label htmlFor="text">Date</label>
                                    <input type="text" value={currentDate} name="" id="" readOnly />
                                    {/* <label htmlFor="date">Start Date</label> */}
                                    {/* <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> */}
                                    <label htmlFor="date">End Date</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                                <div className={styles.leave_reason}>
                                    <label htmlFor="textarea">Reason</label>
                                    <textarea name="" id="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)} >
                                    </textarea>
                                    {
                                        attendance ? `Attendance Already Marked and Your Are ${attendance.status}` :
                                            <button onClick={HandleLeaveRequest}>Request Leave</button>
                                    }
                                </div>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;
