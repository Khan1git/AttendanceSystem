import React, { useEffect, useState } from 'react'
import { useContext } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { UserContext } from '../../context/UserContext';


const Navbar = () => {

  const { user } = useContext(UserContext)
  if (!user) return <p>Loading..</p>
  const isAdmin = user?.isAdmin
  const { profile } = user
  

  // console.log(user)
  return (
    <div>
      <div className="navbar">
        <div className="navContainer">
          <div className="logo_and_inpt">
            <Link
              to="/"
              style={{ color: "black", textDecoration: "none", listStyle: "none" }}
            >
              <span className="logo">Attendance System</span>
            </Link>
            {/* <input type="search" name="" id="" placeholder='search..' /> */}
          </div>
          <div className="navItems">
            <Link
              to='/'

              style={{ color: "black", textDecoration: "none", listStyle: "none" }}
            >
              <span >Home</span>
            </Link>
            {
              isAdmin ? <Link
                to="/dashboard"
                style={{ color: "black", textDecoration: "none", listStyle: "none" }}
              >
                <span>Dashboard</span>
              </Link> : " "
            }
            <Link
              to="/"
              style={{ color: "black", textDecoration: "none", listStyle: "none" }}
            >
              <img src={profile ? profile : 'loading'} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
