// src/components/ISSetup.js
import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import HeaderButtons from './HeaderButtons';
import InstructLine from './InstructLine';
import LoopSegment from './LoopSegment';
import './ISSetup.css';
import PersonaModule from './PersonaModule';
import { defaultSchema } from '../defaultSchema';

function ISSetup() {
  const {
    personas=[],
    setPersonas,
    arrayName='',
    setArrayName,
    instructLines=[],
    setInstructLines,
    addUserSchema
  } = useAppData();
  const [localInstructLines, setLocalInstructLines] = useState(instructLines || []);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!arrayName && localInstructLines.length === 0 && personas.length === 0) {
      loadDefaultSchema();
    }
  // eslint-disable-next-line
  }, []);

  const loadDefaultSchema = () => {
    setArrayName(defaultSchema.personaArray.arrayName);
    setPersonas(defaultSchema.personaArray.personas.map((p,i)=>({
      id:`${Date.now()}_${i}`,
      nickname:p.nickname,
      model:p.model,
      creativity:p.creativity,
      definePersona:p.definePersona
    })));
    setLocalInstructLines(defaultSchema.instructLines);
    setInstructLines(defaultSchema.instructLines);
  };

  const addInstructLine = () => {
    const newLine = {
      id: localInstructLines.length,
      type:'instruct',
      persona:'',
      instructText:'',
      tool:'',
      file:null
    };
    setLocalInstructLines([...localInstructLines, newLine]);
  };

  const addLoopSegment = () => {
    const newLoop = {
      id: localInstructLines.length,
      type:'loop',
      iterations:2,
      mode:'count',
      instructLines:[]
    };
    setLocalInstructLines([...localInstructLines, newLoop]);
  };

  const updateInstructLine = (index, data) => {
    const newLines = [...localInstructLines];
    newLines[index] = {...newLines[index], ...data};
    setLocalInstructLines(newLines);
  };

  const saveInstructSchema = () => {
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
      instructLines: localInstructLines.map(line => ({
        type: line.type,
        persona: line.persona,
        instructText: line.instructText,
        tool: line.tool,
        file: line.file,
        ...(line.type === 'loop' ? {
          iterations: line.iterations,
          mode: line.mode,
          instructLines: line.instructLines.map(l=>({
            type:l.type,
            persona:l.persona,
            instructText:l.instructText,
            tool:l.tool,
            file:l.file
          }))
        } : {})
      }))
    };
    addUserSchema(data);
    alert('IS Schema saved to your My Schemas!');
  };

  const loadSchemaFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.personaArray && data.instructLines) {
          setArrayName(data.personaArray.arrayName);
          setPersonas(data.personaArray.personas.map((p,i)=>({
            id:`${Date.now()}_${i}`,
            nickname:p.nickname,
            model:p.model,
            creativity:p.creativity,
            definePersona:p.definePersona
          })));
          setLocalInstructLines(data.instructLines);
          setInstructLines(data.instructLines);
        } else {
          alert('Invalid IS Schema file.');
        }
      } catch (err) {
        alert('Failed to load IS Schema.');
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const startSequence = () => {
    setInstructLines(localInstructLines);
    navigate('/is-thread');
  };

  const clearAll = () => {
    setArrayName('');
    setPersonas([]);
    setLocalInstructLines([]);
    setInstructLines([]);
  };

  const activePersonas = personas.filter(p => p.nickname || p.definePersona);

  return (
    <div className="is-setup">
      <HeaderButtons
        mainButtonLabel="START SEQUENCE"
        mainButtonColor="#FF007C"
        secondaryButtonLabel="SAVE IS SCHEMA"
        onSecondaryButtonClick={saveInstructSchema}
        setCurrentPage={startSequence}
        pageTitle={`Instruct Sequence Setup - ${arrayName || 'No Array Loaded'}`}
      />
      <div className="load-schema-buttons">
        <button onClick={triggerFileInput} className="load-schema-button">
          LOAD SCHEMA
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          onChange={loadSchemaFile}
          style={{ display: 'none' }}
        />
        <button onClick={clearAll} className="load-schema-button">Clear All</button>
      </div>

      <div className="persona-modules">
        <h4>Available Personas:</h4>
        <div className="persona-module-container">
          {activePersonas.map((p,i)=>(
            <PersonaModule key={i} persona={p} />
          ))}
        </div>
      </div>

      <div className="instruct-lines">
        {localInstructLines.map((line, index) => {
          if (line.type === 'instruct') {
            return <InstructLine key={line.id} index={index} data={line} updateInstructLine={updateInstructLine} />;
          } else {
            return <LoopSegment key={line.id} index={index} data={line} updateInstructLine={updateInstructLine} />;
          }
        })}
        <div className="add-buttons">
          <button onClick={addInstructLine} className="add-button">Add Instruct Line</button>
          <button onClick={addLoopSegment} className="add-button">Add Loop Segment</button>
        </div>
      </div>
    </div>
  );
}

export default ISSetup;
