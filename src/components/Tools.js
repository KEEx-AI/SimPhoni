// src/components/Tools.js
import React, { useState } from 'react';
import './Tools.css';

function Tools() {
  const [showAudioDocs, setShowAudioDocs] = useState(false);

  const toggleAudioDocs = () => {
    setShowAudioDocs(!showAudioDocs);
  };

  return (
    <div className="tools-container">
      <h2>Tools</h2>
      <div className="tool-entry">
        <div className="tool-header" onClick={toggleAudioDocs}>
          <span className="toggle-arrow">{showAudioDocs ? '▼' : '▶'}</span> Audio Transcription Tool
        </div>
        {showAudioDocs && (
          <div className="tool-docs">
            <p>This tool allows your personas to access transcripts of audio files.</p>
            <ol>
              <li>Open a persona line and click "Tools".</li>
              <li>Select "Audio Transcription".</li>
              <li>Choose an audio file from your computer.</li>
              <li>The file is sent to our backend service which uses Whisper to transcribe it.</li>
              <li>The resulting text is appended to the persona's knowledge.</li>
              <li>This persona can now reference that text during inferences.</li>
            </ol>
          </div>
        )}
      </div>
      {/* Future tools can be listed here */}
    </div>
  );
}

export default Tools;
