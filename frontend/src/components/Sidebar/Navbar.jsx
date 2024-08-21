import React, { useState } from 'react'
import './navbar.css'
import { Link } from 'react-router-dom';
import {  LayoutDashboard, House, StickyNote, ListOrdered, Text, ReceiptText, BarChart, Users, Settings, LogOut, ShoppingCart, ShoppingBag, BadgeDollarSign } from 'lucide-react'

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLinkClick = (e) => {
    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
  };

  const handleCollapseClick = (e) => {
    const collapseMenu = e.target.nextElementSibling;
    collapseMenu.classList.toggle('showCollapse');
    const rotateIcon = e.target;
    rotateIcon.classList.toggle('rotate');
  };

  return (
    <>
      <div className={`l-navbar ${isExpanded ? 'expander' : ''}`} id="navbar">
        <nav className="nav">
          <div>
            <div className="nav__brand">
              <ion-icon name="menu-outline" className="nav__toggle" id="nav-toggle" onClick={toggleMenu}><Text /></ion-icon>
              <Link to="#" className="nav__logo"></Link>
            </div>
            <div className="nav__list">
              <Link to={"/"}>
                <Link to="/" className="nav__link " onClick={handleLinkClick}>
                <House />
                  <span className="nav__name">Home</span>
                </Link>
              </Link>
              <Link to={"/dashboard"}>
                <Link to="/dashboard" className="nav__link " onClick={handleLinkClick}>
                  <LayoutDashboard />
                  <span className="nav__name">Dashboard</span>
                </Link>
              </Link>
              <Link to={"/Leave-req"}>
                <Link to="/Leave-req" className="nav__link " onClick={handleLinkClick}>
                <StickyNote />
                  <span className="nav__name">Leave Request</span>
                </Link>
              </Link>
            </div>
          </div>
          {/* <Link to="#" className="nav__link" onClick={handleLinkClick}>
            <ion-icon name="log-out-outline" className="nav__icon"><LogOut /></ion-icon>
            <span className="nav__name">Logout</span>
          </Link> */}
        </nav>
      </div>

    </>
  )
}

export default Navbar
