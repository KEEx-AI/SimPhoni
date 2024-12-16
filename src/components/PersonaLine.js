// src/components/PersonaLine.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import './PersonaLine.css';

function PersonaLine({ index, persona, updatePersona, removePersona }) {
  const [nickname, setNickname] = useState(persona.nickname);
  const [creativity, setCreativity] = useState(persona.creativity);
  const [model, setModel] = useState(persona.model);
  const [definePersona, setDefinePersona] = useState(persona.definePersona);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'MODEL',
    drop: (item) => {
      setModel(item.model.name);
      updatePersona(index, { model: item.model.name });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }), [setModel, updatePersona, index]);

  const savePersona = () => {
    updatePersona(index, { nickname, creativity, definePersona });
  };

  return (
    <div className="persona-line" ref={drop} style={{ backgroundColor: isOver ? '#4A0078' : 'var(--color-bg-medium)' }}>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
        className="nickname-input"
      />
      <div className="model-display">
        {model || 'Drag a model here'}
      </div>
      <div className="creativity-slider">
        <label>Creativity:</label>
        <input
          type="range"
          min="1"
          max="9"
          value={creativity}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setCreativity(val);
            updatePersona(index, { creativity: val });
          }}
        />
        <span>{creativity}</span>
      </div>
      <input
        type="text"
        value={definePersona}
        onChange={(e) => setDefinePersona(e.target.value)}
        placeholder="Define Persona"
        className="define-persona-input"
      />
      <button className="save-persona-button" onClick={savePersona}>Save</button>
      <button className="remove-persona-button" onClick={removePersona}>Remove</button>
    </div>
  );
}

export default PersonaLine;
