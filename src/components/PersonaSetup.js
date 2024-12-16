// src/components/PersonaSetup.js
import React, { useRef, useState } from 'react';
import './PersonaSetup.css';
import HeaderButtons from './HeaderButtons';
import PersonaLine from './PersonaLine';
import { allModels } from '../models';
import { useAppData } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import LoadingIndicator from './LoadingIndicator';
import ModelModule from './ModelModule';

function PersonaSetup() {
  const { personas, setPersonas, arrayName, setArrayName } = useAppData();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (personas.length === 0) {
    initializePersonas();
  }

  function initializePersonas() {
    const initial = Array.from({ length: 9 }, (_, i) => ({
      id: `${Date.now()}_${i}`,
      nickname: '',
      model: '',
      creativity: 5,
      definePersona: ''
    }));
    setPersonas(initial);
  }

  const updatePersona = (index, updated) => {
    const newPs = [...personas];
    newPs[index] = { ...newPs[index], ...updated };
    setPersonas(newPs);
  };

  const removePersona = (index) => {
    const newPs = [...personas];
    newPs[index] = {
      id: `${Date.now()}_${index}`,
      nickname: '',
      model: '',
      creativity: 5,
      definePersona: '',
    };
    setPersonas(newPs);
  };

  const savePersonaArray = () => {
    if (!arrayName.trim()) {
      alert('Please enter a name for the persona array before saving.');
      return;
    }
    const data = { arrayName, personas };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `persona-array-${arrayName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadPersonaArray = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data.personas)) {
          setPersonas(data.personas);
          setArrayName(data.arrayName || '');
        } else {
          alert('Invalid persona array file.');
        }
      } catch (err) {
        alert('Failed to load persona array.');
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const startSetup = () => {
    if (!arrayName.trim()) {
      alert('Please enter a name before continuing.');
      return;
    }
    setShowModal(true);
  };

  const confirmNavigate = async () => {
    setShowModal(false);
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    setIsLoading(false);
    navigate('/is-setup');
  };

  const clearAll = () => {
    setArrayName('');
    initializePersonas();
  };

  return (
    <div className="persona-setup-container">
      {isLoading && <LoadingIndicator message="Preparing IS Setup..." />}
      <HeaderButtons
        mainButtonLabel="CONTINUE TO INSTRUCT SETUP"
        mainButtonColor="#1E90FF"
        secondaryButtonLabel="SAVE PERSONA ARRAY"
        onSecondaryButtonClick={savePersonaArray}
        setCurrentPage={startSetup}
        pageTitle="Persona Array"
      />
      <div className="persona-array-name">
        <label htmlFor="arrayName">Persona Array Name:</label>
        <input
          type="text"
          id="arrayName"
          value={arrayName}
          onChange={(e) => setArrayName(e.target.value)}
          placeholder="Enter persona array name"
          className="array-name-input"
        />
      </div>
      <div className="save-load-buttons">
        <button onClick={savePersonaArray} className="save-button">Save Persona Array</button>
        <button onClick={triggerFileInput} className="load-button">Load Persona Array</button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          onChange={loadPersonaArray}
          style={{ display: 'none' }}
        />
        <button onClick={clearAll} className="clear-all-button">Clear All</button>
      </div>
      <div className="model-modules">
        {allModels.map((model, index) => (
          <ModelModule key={index} model={model} />
        ))}
      </div>
      <div className="persona-lines">
        {personas.map((p, i) => (
          <PersonaLine
            key={p.id}
            index={i}
            persona={p}
            updatePersona={updatePersona}
            removePersona={() => removePersona(i)}
          />
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Continue to IS Setup?">
        <p>Are you sure you want to proceed to IS Setup with the current Persona Array?</p>
        <div className="modal-actions">
          <button onClick={confirmNavigate}>Yes</button>
          <button onClick={() => setShowModal(false)}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default PersonaSetup;
