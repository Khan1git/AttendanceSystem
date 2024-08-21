import React, { useContext } from 'react'
import { useEffect, useState } from 'react';
import styles from './attendance.module.css'
import { UserContext } from '../../context/UserContext';

const Attendance = () => {

    const { user } = useContext(UserContext)
    if (!user) return <p>Loading..</p>
    const [status, setStatus] = useState(''); // 'Present', 'Absent', 'Late'
    const [message, setMessage] = useState('');

    const date = Date()
    const year = date.year

    const handleSubmit = async (event) => {
        event.preventDefault();
        const studentId = 'student123'; // Replace with actual student ID
        const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

        try {
            const response = await fetch('/api/mark-attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId, date, status }),
            });
            const result = await response.json();
            if (result.success) {
                setMessage('Attendance marked successfully!');
            } else {
                setMessage('Failed to mark attendance.');
            }
        } catch (error) {
            setMessage('Error occurred while marking attendance.');
        }
    };

    return (
        <section className={styles.attendance_main}>
            
        </section>
    )
}

export default Attendance
