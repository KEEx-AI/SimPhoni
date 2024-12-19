// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  // Clicking on profile icon -> navigate to /profile-settings
  const goToProfileSettings = () => {
    navigate('/profile-settings');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="logo">
          <img src="/SimPhoni-ISI_LOGO2.png" alt="Logo" className="logo-image" />
        </NavLink>
      </div>
      {currentUser && (
        <div className="navbar-center">
          <NavLink to="/persona-setup" className={({isActive}) => isActive ? 'nav-item active-nav-item' : 'nav-item'}>Personas</NavLink>
          <NavLink to="/is-setup" className={({isActive}) => isActive ? 'nav-item active-nav-item' : 'nav-item'}>IS Setup</NavLink>
          <NavLink to="/is-schemas" className={({isActive}) => isActive ? 'nav-item active-nav-item' : 'nav-item'}>IS Schemas</NavLink>
          <NavLink to="/tools" className={({isActive}) => isActive ? 'nav-item active-nav-item' : 'nav-item'}>Tools</NavLink>
        </div>
      )}
      <div className="navbar-right">
        {currentUser ? (
          <>
            <FaUserCircle size={36} className="profile-icon" onClick={goToProfileSettings} style={{cursor:'pointer'}} />
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="auth-link">Login</NavLink>
            <NavLink to="/signup" className="auth-link">Sign Up</NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
