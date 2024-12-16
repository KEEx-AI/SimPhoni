// src/components/Settings.js
import React, { useState } from 'react';
import { spModels } from '../models';
import './Settings.css';

function Settings() {
  const [defaultSPModel, setDefaultSPModel] = useState('phi3:14b-medium-128k-instruct-fp16');

  const saveSettings = () => {
    alert(`Settings saved! Default S&P model: ${defaultSPModel}`);
    // Persist to backend or local storage as needed
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="setting-field">
        <label>Default S&P Model:</label>
        <select value={defaultSPModel} onChange={(e)=>setDefaultSPModel(e.target.value)}>
          {spModels.map(m=><option key={m.name} value={m.name}>{m.display}</option>)}
        </select>
      </div>
      <button onClick={saveSettings}>Save</button>
    </div>
  );
}

export default Settings;
