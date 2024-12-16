// src/components/SPModelSelector.js
import React from 'react';
import { spModels } from '../models';
import './SPModelSelector.css';

function SPModelSelector({ selectedModel, onSelectModel }) {
  return (
    <div className="sp-model-selector">
      <ul>
        {spModels.map(m => (
          <li
            key={m.name}
            className={selectedModel === m.name ? 'selected' : ''}
            onClick={()=>onSelectModel(m.name)}
          >
            {m.display}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SPModelSelector;
