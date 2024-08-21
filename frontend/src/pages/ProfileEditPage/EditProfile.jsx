import React, { useContext, useEffect, useState } from 'react'
import styles from './edit.module.css'
import Navbar from '../../components/Sidebar/Navbar'
import { useParams } from 'react-router-dom'
import profile from '../../assets/profile.jpeg'
import { format, parseISO } from 'date-fns'
import { UserContext } from '../../context/UserContext'
import { Trash2, EditIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
const EditProfile = () => {
    const { id } = useParams()
    const { user } = useContext(UserContext)
    const [userData, setUserData] = useState([])
    const [userAttendances, setUserAttendences] = useState([])
    const [studentLeaves, setStudentLeaves] = useState([])
    const [todayattendance, setAttendance] = useState([])
    const [status, setStatus] = useState("")
    const [leave, setLeave] = useState('')
    const [date, setDate] = useState('')



    const getUserInformationByid = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/findBy-id/${id}`, {
                method: "GET"
            })
            const result = await response.json()
            setUserData(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { getUserInformationByid() }, [id])

    const FetchAttendance = async () => {

        try {

            const response = await fetch('http://localhost:3000/api/show/all-attendance', {
                method: "GET"
            });
            const result = await response.json();
            const userAttendances = result?.filter(item => item.userId === id);
            setUserAttendences(userAttendances);

            const todayDate = format(new Date(), 'yyyy-MM-dd');
            const todayAttendance = result.find(item => {
                const itemDate = format(parseISO(item.date), 'yyyy-MM-dd');
                return itemDate === todayDate && item.userId === id;
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
                const totalLeaves = result?.filter(item => item.userId === id)
                setStudentLeaves(totalLeaves)

                const todayDate = format(new Date(), 'yyyy-MM-dd');
                const todayLeave = result.find(item => {
                    const leaveStartDate = format(parseISO(item.startDate), 'yyyy-MM-dd');
                    const leaveEndDate = format(parseISO(item.endDate), 'yyyy-MM-dd');
                    return todayDate >= leaveStartDate && todayDate <= leaveEndDate && item.userId.toString() === id.toString();
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
    // console.log(combinedData)


    // ------------------------ 
    const HandleMarkAttendance = async () => {
        const currentDate = new Date().toISOString();

        const data = {
            userId: id,
            status: status,
            date: date
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
                    const todayDate = format(date, 'yyyy-MM-dd');
                    return itemDate === todayDate && item.userId.toString() === id.toString();
                });

                if (todayAttendance) {
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
                    // window.location.reload()
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


    const deleteAttendance = async (id, type) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete this ${type === 'attendance' ? 'attendance record' : 'leave request'}?`);

        if (isConfirmed) {
            try {
                const url = type === 'attendance'
                    ? `http://localhost:3000/api/attendance/delete/${id}`
                    : `http://localhost:3000/api/leave-req/delete/${id}`;

                const response = await fetch(url, {
                    method: "DELETE"
                });

                if (response.ok) {
                    alert(`${type === 'attendance' ? 'Attendance record' : 'Leave request'} has been successfully deleted.`);
                } else {
                    alert(`There was an error deleting the ${type === 'attendance' ? 'attendance record' : 'leave request'}. Please try again.`);
                }
            } catch (error) {
                console.error("Error deleting records:", error);
                alert("An error occurred. Please try again later.");
            }
        } else {
            alert(`${type === 'attendance' ? 'Attendance deletion' : 'Leave request deletion'} canceled.`);
        }
    };


    return (
        <>
            <Navbar />
            <section className={styles.edit_profile_main_container}>
                <h1>Student Record</h1>

                <div className={styles.info_part}>
                    {userData && (
                        <div key={userData._id} className={styles.img_part}>
                            <img src={userData.profile} alt={userData.name} />
                            <div>
                                <h1>Name: {userData.name}</h1>
                                <Link to={`/generate-report/${userData._id}`}>Generate Report</Link>
                            </div>
                        </div>
                    )}
                    <div className={styles.profile_attendance_Part}>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  />
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

                        <button className={styles} onClick={HandleMarkAttendance} >Mark</button>
                        {/* <button onClick={() => setActiveSection('Leave')}>Leave</button> */}
                    </div>
                </div>
                <div className={styles.records_part}>
                    <div className={styles.record_table}>
                        <table border={1}>
                            <thead>
                                <th>No</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </thead>
                            {combinedData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{format(parseISO(item.date || item.startDate), 'yyyy-MM-dd')}</td>
                                    <td>{item.status === 'Pending' || item.status === 'Approved' || item.status === 'Rejected' ? 'Leave Request' : "Attendence"}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Link to={item.type === 'attendance' ? `/edit-attendance/${item._id}` : `/edit-leave/${item._id}`}><EditIcon strokeWidth={0.9}/></Link>
                                    </td>
                                    <td>
                                        <Trash2 onClick={() => deleteAttendance(item._id, item.type)} strokeWidth={0.9} />
                                    </td>

                                </tr>
                            ))}

                        </table>

                    </div>

                </div>
            </section>
        </>
    )
}

export default EditProfile
