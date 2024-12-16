// src/components/InstructSchemas.js
import React, { useState } from 'react';
import './InstructSchemas.css';

function InstructSchemas() {
  const [privateSchemas, setPrivateSchemas] = useState([]);
  const [sharedSchemas, setSharedSchemas] = useState([]);
  const [publicSchemas, setPublicSchemas] = useState([]);

  return (
    <div className="instruct-schemas-container">
      <h2>Instruct Schemas</h2>
      <div className="schemas-section">
        <h3>Private Schemas</h3>
        {privateSchemas.length > 0 ? (
          <ul>
            {privateSchemas.map(schema => (
              <li key={schema.id}>
                <strong>{schema.name}</strong> - {schema.access}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Private Schemas found.</p>
        )}
      </div>
      <div className="schemas-section">
        <h3>Shared Schemas</h3>
        {sharedSchemas.length > 0 ? (
          <ul>
            {sharedSchemas.map(schema => (
              <li key={schema.id}>
                <strong>{schema.name}</strong> - {schema.access}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Shared Schemas found.</p>
        )}
      </div>
      <div className="schemas-section">
        <h3>Public Schemas</h3>
        {publicSchemas.length > 0 ? (
          <ul>
            {publicSchemas.map(schema => (
              <li key={schema.id}>
                <strong>{schema.name}</strong> - {schema.access}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Public Schemas found.</p>
        )}
      </div>
    </div>
  );
}

export default InstructSchemas;
