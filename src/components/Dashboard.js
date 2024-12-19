// src/components/Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { getO1ResearchDemo } from '../services/O1Service';

function Dashboard() {
  const [showDemo, setShowDemo] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleShowDemo = async () => {
    setLoadingDemo(true);
    try {
      const result = await getO1ResearchDemo();
      setDemoText(result);
      setShowDemo(true);
    } catch (error) {
      console.error("Failed to load O1 research demo:", error);
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="quick-links">
        <h3>Quick Navigation</h3>
        <ul>
          <li><Link to="/persona-setup">Personas</Link></li>
          <li><Link to="/is-setup">IS Setup</Link></li>
          <li><Link to="/is-schemas">IS Schemas</Link></li>
          <li><Link to="/tools">Tools</Link></li>
        </ul>
      </div>

      <div className="o1-demo-section">
        <button
          className="o1-demo-button"
          onClick={handleShowDemo}
          title="Click to see O1’s research capabilities!"
        >
          {loadingDemo ? 'Loading Demo...' : 'Show O1 Research Demo'}
        </button>
      </div>

      {showDemo && (
        <div className="o1-demo-modal">
          <div className="o1-demo-content">
            <h2>O1 Research Demonstration</h2>
            <div className="o1-demo-text">
              {demoText}
            </div>
            <button onClick={()=>setShowDemo(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
