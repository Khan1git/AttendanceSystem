import React, { useState, useEffect } from 'react'
import styles from './signup.module.css'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [file, setFile] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [dob, setDob] = useState('')
    const [hasAdmin, setHasAdmin] = useState(false)
    const [admin, setAdmin] = useState(false)
    const navigate = useNavigate()
    console.log(admin)


    
  const handleCheckboxChange = (e) => {
    setAdmin(e.target.checked);
  };


    useEffect(() => {
        const loggedIn = localStorage.getItem('accessToken')
        if (loggedIn) {
            navigate('/')
        }
    }, [navigate])

    const handleAddStudent = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('profile', file)
        formData.append('address', address)
        formData.append('dob', dob)
        formData.append('isAdmin', admin)

        try {
            const response = await fetch('http://localhost:3000/api/auth/sign-up', {
                method: "POST",
                body: formData
            })
            if (response.ok) {
                alert('User added successfully')
                navigate('/log-in')
            }
        } catch (error) {
            console.error("An error has occurred:", error)
        }
    }

    const getAllStudents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/get-all', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const result = await response.json()
                const isAdminExists = result.some(item => item.isAdmin === true)
                setHasAdmin(isAdminExists)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
        }
    }

    useEffect(() => {
        getAllStudents()
    }, [])

    return (
        <section className={styles.signup_main_container}>
            <h1>Welcome To the Attendance System: Please Signup</h1>
            <div className={styles.signup_form}>
                <form action="" onSubmit={handleAddStudent}>
                    <div className={styles.signup_inputs}>
                        <label htmlFor="file">Photo</label>
                        <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <div className={styles.signup_inputs}>
                        <label htmlFor="Name">Name</label>
                        <input type="text" name="Name" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={styles.signup_inputs}>
                        <label htmlFor="Email">Email</label>
                        <input type="email" name="email" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.signup_inputs}>
                        <label htmlFor="Address">Address</label>
                        <input type="text" name="address" placeholder='Enter Your Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className={styles.signup_inputs}>
                        <label htmlFor="dob">DOB</label>
                        <input type="date" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                    <div className={styles.signup_inputs}>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {!hasAdmin && (
                        <div className={styles.signup_inputs_admin_box}>
                            <label htmlFor="isAdmin">Admin</label>
                            <input type="checkbox" name="isAdmin" value={admin} onChange={handleCheckboxChange} className={styles.admin_box} />
                        </div>
                    )}
                    <div className={styles.signup_buttons}>
                        <button type='submit'>Signup</button>
                        <Link to={'/log-in'}>Already have an account?</Link>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Signup
