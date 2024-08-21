import React, { useEffect } from 'react'
import Navbar from '../../components/navbar/Navbars'
import styles from './accountedit.module.css'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AccountEdit = () => {

  const [file, setFile] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  const FindUserByid = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/findBy-id/${id}`, {
        method: "GET"
      })
      const result = await response.json()
      console.log(result)
      setFile(result.profile)
      setEmail(result.email)
      setName(result.name)
      setAddress(result.address)
      setDob(result.dob)
    } catch (error) {
      console.log(error)

    }
  }

  useEffect(() => {
    FindUserByid()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('dob', dob);
    formData.append('profile', file); 

    try {
      // Wrap the fetch request with toast.promise
      await toast.promise(
        fetch(`http://localhost:3000/api/auth/updateBy-id/${id}`, {
          method: "PUT",
          body: formData
        }).then(response => {
          if (response.ok) {
            // return response.json();
            navigate('/')
          } else {
            throw new Error('Failed to update student info');
          }
        }),
        {
          pending: 'Updating Student information...',
          success: 'Student information updated successfully!',
          // error: 'An error occurred while updating the Student'
        }
      );

    } catch (error) {
      console.error("Error updating Student:", error);
      // toast.error('An error occurred while updating the Student');
    }
  };



  return (
    <>
      <Navbar />
      <section className={styles.account_edit_main}>
        <div className={styles.account_edit_form}>
          <form action="" onSubmit={handleUpdate}>
            <div className={styles.account_edit_inputs}>
              <label htmlFor="file">Photo</label>
              <input type="file" name="file" id="" placeholder='Enter Your Name' onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className={styles.account_edit_inputs}>
              <label htmlFor="Name">Name</label>
              <input type="text" name="Name" id="" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.account_edit_inputs}>
              <label htmlFor="Name">Email</label>
              <input type="email" name="email" id="" placeholder='Enter Your Name' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.account_edit_inputs}>
              <label htmlFor="Address">Address</label>
              <input type="text" name="password" id="" placeholder='Enter Your Address' value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className={styles.account_edit_inputs}>
              <label htmlFor="dob">DOB</label>
              <input type="date" name="password" id="" placeholder='Enter Your dob' value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className={styles.account_edit_buttons}>
              <button type='submit'>Update</button>
            </div>

          </form>
        </div>

      </section>
    </>
  )
}

export default AccountEdit
