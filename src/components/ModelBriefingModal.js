// src/components/ModelBriefingModal.js

import React from 'react';
import { getModelProfile } from '../services/ModelProfileService';
import './ModelBriefingModal.css';

const ModelBriefingModal = ({ modelName, onClose }) => {
  const modelProfile = getModelProfile(modelName);

  if (!modelProfile) {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>&times;</span>
          <h2>Model Profile Not Found</h2>
          <p>No profile for {modelName}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{modelName} Profile</h2>
        <h4>Strengths:</h4>
        <ul>{modelProfile.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul>
        <h4>Weaknesses:</h4>
        <ul>{modelProfile.weaknesses.map((w,i)=><li key={i}>{w}</li>)}</ul>
        <h4>Ideal Use Cases:</h4>
        <ul>{modelProfile.idealUseCases.map((u,i)=><li key={i}>{u}</li>)}</ul>
        <h4>Limitations:</h4>
        <ul>{modelProfile.limitations.map((l,i)=><li key={i}>{l}</li>)}</ul>
      </div>
    </div>
  );
};

export default ModelBriefingModal;
