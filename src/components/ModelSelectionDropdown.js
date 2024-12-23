// src/components/ModelSelectionDropdown.js

import React, { useState, useEffect } from 'react';
import { allModels } from '../models';
import { getModelProfile } from '../services/ModelProfileService';
import './ModelSelectionDropdown.css';

const ModelSelectionDropdown = ({ onSelect }) => {
  const [selectedModel, setSelectedModel] = useState('QwQ');
  const [modelProfile, setModelProfile] = useState(null);

  useEffect(() => {
    const profile = getModelProfile(selectedModel);
    setModelProfile(profile);
  }, [selectedModel]);

  const handleChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    onSelect(model);
  };

  return (
    <div className="model-selection-dropdown">
      <label htmlFor="model-select">Select S&P Model:</label>
      <select id="model-select" value={selectedModel} onChange={handleChange}>
        {allModels.map(m => (
          <option key={m.name} value={m.name}>{m.display}</option>
        ))}
      </select>
      {modelProfile && (
        <div className="model-profile">
          <h3>Model Profile: {selectedModel}</h3>
          <h4>Strengths:</h4>
          <ul>{modelProfile.strengths.map((s, i)=><li key={i}>{s}</li>)}</ul>
          <h4>Weaknesses:</h4>
          <ul>{modelProfile.weaknesses.map((w, i)=><li key={i}>{w}</li>)}</ul>
          <h4>Ideal Use Cases:</h4>
          <ul>{modelProfile.idealUseCases.map((u, i)=><li key={i}>{u}</li>)}</ul>
          <h4>Limitations:</h4>
          <ul>{modelProfile.limitations.map((l, i)=><li key={i}>{l}</li>)}</ul>
        </div>
      )}
    </div>
  );
};

export default ModelSelectionDropdown;
