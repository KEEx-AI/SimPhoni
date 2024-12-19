// src/components/InstructSchemas.js -> now named ISSchemas.js
import React, { useState } from 'react';
import './ISSchemas.css';
import { useAppData } from '../context/AppContext';

function ISSchemas() {
  const { userSchemas } = useAppData();
  const [manageMode, setManageMode] = useState(false);

  const toggleManageMode = () => setManageMode(!manageMode);

  return (
    <div className="is-schemas-container">
      <h2>IS Schemas</h2>
      <div className="schemas-panels">
        <div className={`my-schemas-panel ${manageMode?'manage-mode':''}`}>
          <div className="panel-header">
            <h3>My Schemas</h3>
            <button className="manage-button" onClick={toggleManageMode}>
              {manageMode?'Done':'Manage'}
            </button>
          </div>
          {!manageMode && (
            <ul>
              {userSchemas.map(s => (
                <li key={s.id}>{s.personaArray.arrayName}</li>
              ))}
            </ul>
          )}
          {manageMode && (
            <div className="manage-view">
              <ul>
                {userSchemas.map(s => (
                  <li key={s.id}>
                    <span className="schema-name">{s.personaArray.arrayName}</span>
                    <div className="actions">
                      <button>Rename</button>
                      <button>Edit Sharing</button>
                      <button>Download</button>
                      <button>Upload</button>
                      <button>Load In New Tab</button>
                      <button>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="violett-schemas-panel">
          <h3>Viólett Schemas (Public)</h3>
          <p>No public schemas implemented yet.</p>
        </div>
        <div className="communiti-schemas-panel">
          <h3>Communiti Schemas (Communiti+)</h3>
          <p>No Communiti schemas implemented yet.</p>
        </div>
      </div>
    </div>
  );
}

export default ISSchemas;
