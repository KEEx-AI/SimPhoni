// src/components/PersonaLine.js
import React, { useRef } from 'react';
import './PersonaLine.css';
import { useDrop } from 'react-dnd';

function PersonaLine({ index, persona, updatePersona, removePersona }) {
  const fileInputRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'MODEL',
    drop: (item) => {
      updatePersona(index, { model: item.model.name });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }), [updatePersona, index]);

  const handleNicknameChange = (e) => {
    updatePersona(index, { nickname: e.target.value });
  };

  const handleCreativityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    updatePersona(index, { creativity: val });
  };

  const handleDefinePersonaChange = (e) => {
    updatePersona(index, { definePersona: e.target.value });
  };

  const triggerAudioTranscription = () => {
    fileInputRef.current.click();
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected audio file for transcription:', file);
      // Integrate the transcription logic as needed, store output in persona's data
    }
  };

  return (
    <div className="persona-line" ref={drop} style={{ backgroundColor: isOver ? '#4A0078' : 'var(--color-bg-medium)' }}>
      <input
        type="text"
        value={persona.nickname}
        onChange={handleNicknameChange}
        placeholder="Nickname"
        className="nickname-input"
      />

      <div className="model-display">
        {persona.model || 'Drag a model here'}
      </div>

      <div className="creativity-slider">
        <label>Creativity:</label>
        <input
          type="range"
          min="1"
          max="9"
          value={persona.creativity}
          onChange={handleCreativityChange}
        />
        <span>{persona.creativity}</span>
      </div>

      <input
        type="text"
        value={persona.definePersona}
        onChange={handleDefinePersonaChange}
        placeholder="Define Persona"
        className="define-persona-input"
      />

      <button className="tools-button" onClick={triggerAudioTranscription}>Tools</button>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleAudioFileChange}
      />

      <button className="remove-persona-button" onClick={removePersona}>Remove</button>
    </div>
  );
}

export default PersonaLine;
