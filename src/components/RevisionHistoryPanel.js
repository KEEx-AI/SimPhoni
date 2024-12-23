// src/components/RevisionHistoryPanel.js
import React, { useState } from 'react';
import './RevisionHistoryPanel.css';

function RevisionHistoryPanel({ revisions = [] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="revision-history-panel">
      <h3 onClick={() => setExpanded(!expanded)}>
        Revision History {expanded ? '▼' : '▶'}
      </h3>
      {expanded && (
        <div className="rh-entries">
          {revisions.length === 0 && <p>No revisions found.</p>}
          {revisions.map((rev, i) => (
            <div key={i} className="rh-entry">
              <h4>Revision {i + 1}</h4>
              <p><strong>Timestamp:</strong> {rev.timestamp}</p>
              <pre>{JSON.stringify(rev.changes, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RevisionHistoryPanel;
