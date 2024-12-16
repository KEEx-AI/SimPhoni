// src/components/Dashboard.js
import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext';

function Dashboard() {
  const { personas, instructLines } = useAppData();
  const personaCount = personas.length;
  const schemaCount = 4; // mock data
  const arraysCount = 3; // mock data

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{personaCount}</h2>
          <p>Personas Defined</p>
        </div>
        <div className="stat-card">
          <h2>{arraysCount}</h2>
          <p>Persona Arrays</p>
        </div>
        <div className="stat-card">
          <h2>{schemaCount}</h2>
          <p>Instruct Schemas</p>
        </div>
      </div>
      <div className="quick-links">
        <h3>Quick Navigation</h3>
        <ul>
          <li><Link to="/persona-setup">Persona Setup</Link></li>
          <li><Link to="/is-setup">IS Setup</Link></li>
          <li><Link to="/instruct-schemas">Instruct Schemas</Link></li>
          <li><Link to="/my-arrays">My Arrays</Link></li>
          <li><Link to="/tools">Tools</Link></li>
          <li><Link to="/is-thread">IS Thread</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
