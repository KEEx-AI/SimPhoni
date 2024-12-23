// src/components/ExtendedSettings.js
import React, { useState } from 'react';
import './ExtendedSettings.css';

function ExtendedSettings() {
  const [enableAudioEquip, setEnableAudioEquip] = useState(true);
  const [enableImageEquip, setEnableImageEquip] = useState(true);
  const [enableWebSearch, setEnableWebSearch] = useState(false);

  const handleSave = () => {
    // Persist these to Firestore or local storage
    alert(`Settings saved: \nAudioEquip=${enableAudioEquip}, ImageEquip=${enableImageEquip}, WebSearch=${enableWebSearch}`);
  };

  return (
    <div className="extended-settings">
      <h2>Extended Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={enableAudioEquip}
          onChange={(e) => setEnableAudioEquip(e.target.checked)}
        />
        Enable Audio Equip
      </label>
      <label>
        <input
          type="checkbox"
          checked={enableImageEquip}
          onChange={(e) => setEnableImageEquip(e.target.checked)}
        />
        Enable Image Equip
      </label>
      <label>
        <input
          type="checkbox"
          checked={enableWebSearch}
          onChange={(e) => setEnableWebSearch(e.target.checked)}
        />
        Enable Web Search
      </label>
      <button className="save-btn" onClick={handleSave}>Save</button>
    </div>
  );
}

export default ExtendedSettings;
