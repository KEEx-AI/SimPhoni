// src/components/PersonaSetup.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  const { personas, setPersonas, arrayName, setArrayName, addUserSchema } = useAppData();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializePersonas = useCallback(() => {
    const initial = Array.from({ length: 9 }, (_, i) => ({
      id: `${Date.now()}_${i}`,
      nickname: '',
      model: '',
      creativity: 5,
      definePersona: ''
    }));
    setPersonas(initial);
  }, [setPersonas]);

  useEffect(() => {
    if (personas.length === 0) {
      initializePersonas();
    }
  }, [personas, initializePersonas]);

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

  const clearAll = () => {
    setArrayName('');
    initializePersonas();
  };

  const saveInstructSchema = () => {
    if (!arrayName.trim()) {
      alert('Please enter a name before saving the IS Schema.');
      return;
    }

    const data = {
      personaArray: {
        arrayName,
        personas: personas.map(p => ({
          nickname: p.nickname,
          model: p.model,
          creativity: p.creativity,
          definePersona: p.definePersona
        }))
      },
      instructLines: []
    };

    addUserSchema(data);

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${arrayName || 'Unnamed'}-ISSchema.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('IS Schema saved to your My Schemas list.');
  };

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

  const triggerFileInput = () => fileInputRef.current.click();

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

  return (
    <div className="persona-setup-container">
      {isLoading && <LoadingIndicator message="Preparing IS Setup..." />}
      <HeaderButtons
        mainButtonLabel="CONTINUE TO INSTRUCT SETUP"
        mainButtonColor="#1E90FF"
        secondaryButtonLabel="SAVE IS SCHEMA"
        onSecondaryButtonClick={saveInstructSchema}
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
        {/* Remove 'Save Persona Array' and 'Load Persona Array' if not needed */}
        {/* <button onClick={savePersonaArray} className="save-button">Save Persona Array</button>
        <button onClick={triggerFileInput} className="load-button">Load Persona Array</button> */}
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
