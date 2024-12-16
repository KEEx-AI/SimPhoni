// src/components/InferenceResultsPanel.js
import React from 'react';
import './InferenceResultsPanel.css';

function InferenceResultsPanel({ results }) {
  if (!results || results.length === 0) {
    return <div className="inference-results-panel">No Results Yet</div>;
  }

  return (
    <div className="inference-results-panel">
      <h4>Inference Results</h4>
      <ul>
        {results.map((r,i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}

export default InferenceResultsPanel;
