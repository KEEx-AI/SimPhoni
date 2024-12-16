// src/components/InstructLine.js
import React, { useState } from 'react';
import './InstructLine.css';
import { useDrop } from 'react-dnd';

function InstructLine({ index, data, updateInstructLine }) {
  const [instructText, setInstructText] = useState(data.instructText || '');
  const [persona, setPersona] = useState(data.persona || '');

  const [{ isOver }, drop] = useDrop(() => ({
    accept:'PERSONA',
    drop:(item) => {
      setPersona(item.persona.nickname);
      updateInstructLine(index, { persona: item.persona.nickname });
    },
    collect:(monitor)=>({ isOver:!!monitor.isOver() })
  }), [index, updateInstructLine]);

  const handleTextChange = (e) => {
    setInstructText(e.target.value);
    updateInstructLine(index, { instructText: e.target.value });
  };

  return (
    <div className="instruct-line" ref={drop} style={{ backgroundColor: isOver ? '#4A0078' : 'var(--color-bg-light)' }}>
      <textarea
        value={instructText}
        onChange={handleTextChange}
        placeholder="Instruct Text"
        className="instruct-textarea"
      />
      <div className="persona-display">
        {persona || 'Drop Persona Here'}
      </div>
    </div>
  );
}

export default InstructLine;
