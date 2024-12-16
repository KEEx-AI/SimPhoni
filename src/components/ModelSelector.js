// src/components/ModelSelector.js
import React, { useState } from 'react';
import './ModelSelector.css';
import { allModels } from '../models';

function ModelSelector({ selectedModel, onSelectModel }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = allModels.filter(m =>
    m.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="model-selector-advanced">
      <h4>Select a Model</h4>
      <input
        type="text"
        placeholder="Search models..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="model-search"
      />
      <div className="model-list">
        {filteredModels.map((m, i) => (
          <div
            key={i}
            className={`model-option ${selectedModel === m.value ? 'selected' : ''}`}
            onClick={() => onSelectModel(m.value)}
          >
            {m.display}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
