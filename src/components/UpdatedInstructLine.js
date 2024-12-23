// src/components/UpdatedInstructLine.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import AudioEquipButton from './AudioEquipButton';
import ImageEquipButton from './ImageEquipButton';
import './UpdatedInstructLine.css';

function UpdatedInstructLine({ index, data, updateInstructLine }) {
  const [instructText, setInstructText] = useState(data.instructText || '');
  const [persona, setPersona] = useState(data.persona || '');
  const isVisionModel = persona.toLowerCase().includes('vision');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PERSONA',
    drop: (item) => {
      setPersona(item.persona.nickname);
      updateInstructLine(index, { persona: item.persona.nickname });
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() })
  }), [index, updateInstructLine]);

  const handleTextChange = (e) => {
    setInstructText(e.target.value);
    updateInstructLine(index, { instructText: e.target.value });
  };

  const handleAudioTranscribed = (text) => {
    // Example: append it to the instructText
    const updated = `${instructText}\n[AudioTranscript]: ${text}`;
    setInstructText(updated);
    updateInstructLine(index, { instructText: updated });
  };

  const handleImageAttached = (file) => {
    console.log("Attached image for line: ", file);
    updateInstructLine(index, { file });
  };

  const handleWebSearch = () => {
    alert("Web search not yet implemented - placeholder!");
  };

  return (
    <div
      className="updated-instruct-line"
      ref={drop}
      style={{ backgroundColor: isOver ? '#4A0078' : 'var(--color-bg-light)' }}
    >
      <textarea
        value={instructText}
        onChange={handleTextChange}
        placeholder="Instruct Text"
        className="instruct-textarea"
      />
      <div className="persona-display">
        {persona || 'Drop Persona Here'}
      </div>
      <div className="tool-row">
        <button onClick={handleWebSearch} className="websearch-btn">Web-Search</button>
        <AudioEquipButton onAudioTranscribed={handleAudioTranscribed} />
        <ImageEquipButton isVisionModel={isVisionModel} onImageAttached={handleImageAttached} />
      </div>
    </div>
  );
}

export default UpdatedInstructLine;
