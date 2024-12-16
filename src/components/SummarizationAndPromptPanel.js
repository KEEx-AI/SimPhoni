// src/components/SummarizationAndPromptPanel.js
import React from 'react';
import './SummarizationAndPromptPanel.css';

function SummarizationAndPromptPanel({ spOutputs }) {
  return (
    <div className="summarization-prompt-panel">
      <h4>Summarization & Prompt</h4>
      <div className="sp-outputs-list">
        {spOutputs.map((o,i)=>(
          <div key={i} className="sp-output-entry">
            <div className="sp-output-header">
              S&P Entry {i+1}
            </div>
            <div className="sp-output-content">
              <pre>{o}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummarizationAndPromptPanel;
s
