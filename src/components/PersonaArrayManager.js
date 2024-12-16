// src/components/PersonaArrayManager.js
import React from 'react';
import './PersonaArrayManager.css';

function PersonaArrayManager({ arrays }) {
  return (
    <div className="persona-array-manager">
      <h4>Your Persona Arrays</h4>
      {arrays && arrays.length > 0 ? (
        <ul>
          {arrays.map((a, i) => (
            <li key={i}>{a.arrayName} - {a.personas.length} personas</li>
          ))}
        </ul>
      ) : (
        <p>No arrays found.</p>
      )}
    </div>
  );
}

export default PersonaArrayManager;
