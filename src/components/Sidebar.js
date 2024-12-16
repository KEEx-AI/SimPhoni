// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ title, children }) {
  return (
    <div className="sidebar-container">
      <h3>{title}</h3>
      <div className="sidebar-content">
        {children}
      </div>
    </div>
  );
}

export default Sidebar;
