// src/components/MyArrays.js
import React, { useState } from 'react';
import './MyArrays.css';

function MyArrays() {
  const [personalArrays, setPersonalArrays] = useState([]);
  const [sharedArrays, setSharedArrays] = useState([]);
  const [publicArrays, setPublicArrays] = useState([]);

  // This is placeholder logic; you'd load from Firestore or a backend.
  
  return (
    <div className="my-arrays-container">
      <h2>My Arrays</h2>
      <div className="arrays-section">
        <h3>Personal Arrays</h3>
        {personalArrays.length > 0 ? (
          <ul>
            {personalArrays.map(array => (
              <li key={array.id}>{array.name} - {array.access}</li>
            ))}
          </ul>
        ) : <p>No Personal Arrays found.</p>}
      </div>
      <div className="arrays-section">
        <h3>Shared Arrays</h3>
        {sharedArrays.length > 0 ? (
          <ul>
            {sharedArrays.map(array => (
              <li key={array.id}>{array.name} - {array.access}</li>
            ))}
          </ul>
        ) : <p>No Shared Arrays found.</p>}
      </div>
      <div className="arrays-section">
        <h3>Public Arrays</h3>
        {publicArrays.length > 0 ? (
          <ul>
            {publicArrays.map(array => (
              <li key={array.id}>{array.name} - {array.access}</li>
            ))}
          </ul>
        ) : <p>No Public Arrays found.</p>}
      </div>
    </div>
  );
}

export default MyArrays;
