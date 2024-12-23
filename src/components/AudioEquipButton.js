// src/components/AudioEquipButton.js
import React, { useRef } from 'react';
import './AudioEquipButton.css';

export default function AudioEquipButton({ onAudioTranscribed }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Build FormData to send file in multipart/form-data
      const formData = new FormData();
      formData.append('file', file);

      // Adjust the URL if your FastAPI server runs on another port or domain
      const response = await fetch('http://localhost:8000/api/audio-transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Expecting { "transcript": "... text ..." } from the server
      const data = await response.json();
      const transcript = data.transcript || '(No transcript returned)';

      onAudioTranscribed(transcript);
    } catch (err) {
      console.error("Audio transcription error: ", err);
      // Optionally pass the error to your parent, or just log it
      onAudioTranscribed(`Error: ${err.message}`);
    }
  };

  return (
    <div className="audio-equip">
      <button className="audio-btn" onClick={handleButtonClick}>
        Audio-equip
      </button>
      <input
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
