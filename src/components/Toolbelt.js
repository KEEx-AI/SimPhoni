// src/components/Toolbelt.js
import React from 'react';
import './Toolbelt.css';

export default function Toolbelt({ onWebSearch, onAudioEquip, onImageEquip }) {
  return (
    <div className="toolbelt">
      <button onClick={onWebSearch} className="tool-icon websearch">Web</button>
      <button onClick={onAudioEquip} className="tool-icon audio">Audio</button>
      <button onClick={onImageEquip} className="tool-icon image">Image</button>
    </div>
  );
}
