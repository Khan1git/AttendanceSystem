import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/Sidebar/Navbar';
import styles from './dashboard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Eye, Trash2, SquarePen } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [Present, setPresent] = useState(0)
  console.log(Present)
  const navigate = useNavigate()
  // Fetch students data
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/get-all', {
        method: "GET",
      });
      const result = await response.json();
      setStudents(result);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/show/all-attendance', {
        method: "GET",
      });
      const result = await response.json();
      const todayDate = format(new Date(), 'yyyy-MM-dd');

      const todayAttendance = result.filter(item => {
        const itemDate = format(parseISO(item.date), 'yyyy-MM-dd');
        return itemDate === todayDate;
      });
      const presentCount = todayAttendance.filter(item => item.status === 'Present' ).length;
      const absentCount = todayAttendance.filter(item => item.status === 'Absent').length;
      const leaveCount = todayAttendance.filter(item => 
        item.status === 'Rejected' || 
        item.status === 'Approved' 
      ).length;
      setPresent(absentCount)


      setAttendanceData(todayAttendance);
    } catch (error) {
      console.log(error);
    }
  };

  // Combine students and attendance data
  const combineData = () => {
    return students.map(student => {
      const studentAttendance = attendanceData.find(att => att.userId === student._id);
      return {
        ...student,
        attendanceStatus: studentAttendance ? studentAttendance.status : 'Leave', // Default to 'Leave' if no attendance found
      };
    });
  };

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);


  const deleteAccount = async (id) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete account ${id}.`);

    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/delete/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("Your account has been successfully deleted. ${}");

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
    <>
      <Navbar />
      <section className={styles.dashboard_main_container}>
        <div className={styles.head}>
          <h1>Welcome Admin</h1>
          <Link to={'/daily-report'}>
            <button> Daily Report</button>
          </Link>
        </div>
        <div className={styles.Dashboardcards}>
          <div className={styles.card1}>
            <Users />
            <p>Total Students</p>
            <p>{students.length}</p>
          </div>
          <div className={styles.card1}>
            <Users />
            <p>Today Total Present</p>
            <p>
              {attendanceData.filter(att =>
                att.status === 'Present' 
              ).length}
            </p>
          </div>
          <div className={styles.card1}>
            <Users />
            <p>Today Total Absents</p>
            <p>{attendanceData.filter(att => att.status === 'Absent').length}</p>
          </div>
          <div className={styles.card1}>
            <Users />
            <p>Today Total On Leave</p>
            <p>
              {attendanceData.filter(att =>
                (
                  att.status === 'Rejected' ||
                  att.status === 'Pending' ||
                  att.status === 'Absent' ||
                  att.status === 'Leave') &&
                att.date || att.startDate === Date.now()
              ).length}
            </p>
          </div>
        </div>
        <div className={styles.students_list_section}>
          <h1>All Students</h1>
          <input
            type="search"
            className={styles.student_search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Enter student Name....'
          />
          <div className={styles.student_table}>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Dob</th>
                  <th>Email</th>
                  <th>Attendance Status</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>Visit</th>
                </tr>
              </thead>
              <tbody>
                {combineData().filter(student => student.name.toLowerCase().includes(search.toLowerCase())).map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td><img src={student.profile} alt="" /></td>
                    <td>{student.name}</td>
                    <td>{format(parseISO(student.dob), 'yyyy-MM-dd')}</td>
                    <td>{student.email}</td>
                    <td>{student.attendanceStatus}</td> {/* Show attendance status */}
                    <td>
                      <Link to={`/edit-info/${student._id}`}>
                        <SquarePen strokeWidth={0.9} size={20} />
                      </Link>
                    </td>
                    <td><Trash2 strokeWidth={0.9} onClick={() => deleteAccount(student._id)} size={20} /></td>
                    <td>
                      <Link to={`/edit-profile/${student._id}`}>
                        <Eye strokeWidth={0.9} size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
