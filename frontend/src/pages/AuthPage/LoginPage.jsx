import React, { useEffect } from 'react'
import styles from './login.module.css'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import {toast} from 'react-hot-toast' 

const LoginPage = () => {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    useEffect(()=>{
        const LogedIn =localStorage.getItem('accessToken')
        if (LogedIn) {
            navigate('/')
        }
    },[navigate])

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!email | !password) {
            toast.error('Please provide all information')
        }
        try {
            const result = await fetch('http://localhost:3000/api/auth/log-in', {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ email: email, password: password })
            })
            if (result.ok) {
                toast.success('Login Successfull')
                const { token } = await result.json();
                localStorage.setItem('accessToken', token);
                const userResponse = await fetch('http://localhost:3000/api/auth/allow-me', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const userData = await userResponse.json();
                setUser(userData);
                navigate('/')
            }
            else if (!result.ok) {
                toast.error("Invalid Credientials")
            }
        } catch (error) {
            toast.error("Invalid Credientials")
            console.log("Failed", error)
        }

    }



    return (
        <section className={styles.login_main_container}>
            <h1>Welcome To the Attendance System: Please login</h1>
            <div className={styles.login_form}>
                <form action="" onSubmit={handleLogin}>
                    <div className={styles.login_inputs}>
                        <label htmlFor="Name">Email</label>
                        <input type="email" name="email" id="" placeholder='Enter Your Name' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.login_inputs}>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="" placeholder='Enter Your Name' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className={styles.login_buttons}>
                        <button type='submit'>login</button>
                        <Link to={'/sign-up'}>Don't have an account</Link>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default LoginPage
