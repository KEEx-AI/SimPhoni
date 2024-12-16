// src/components/LoopSegment.js
import React, { useState } from 'react';
import './LoopSegment.css';
import InstructLine from './InstructLine';

function LoopSegment({ index, data, updateInstructLine }) {
  const [iterations, setIterations] = useState(data.iterations || 2);
  const [mode, setMode] = useState(data.mode || 'count'); // 'count' or 'condition'
  const [loopInstructLines, setLoopInstructLines] = useState(data.instructLines || []);

  const handleIterationChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setIterations(value);
    updateInstructLine(index, { iterations:value, instructLines:loopInstructLines });
  };

  const handleModeChange = (e) => {
    const val = e.target.value;
    setMode(val);
    updateInstructLine(index, { mode:val, instructLines:loopInstructLines });
  };

  const addLoopLine = () => {
    const newLine = {
      id: loopInstructLines.length,
      instructText:'',
      persona:'',
      tool:'',
      file:null,
      type:'instruct'
    };
    const newLines = [...loopInstructLines, newLine];
    setLoopInstructLines(newLines);
    updateInstructLine(index, { instructLines:newLines, mode, iterations });
  };

  const updateLoopLine = (i, updatedData) => {
    const newLines = [...loopInstructLines];
    newLines[i] = {...newLines[i], ...updatedData};
    setLoopInstructLines(newLines);
    updateInstructLine(index, { instructLines:newLines, mode, iterations });
  };

  return (
    <div className="loop-segment">
      <div className="loop-header">
        <label>Loop Iterations:</label>
        <input
          type="number"
          value={iterations}
          onChange={handleIterationChange}
          min="1"
          className="loop-iteration-input"
        />
        <div className="loop-mode">
          <label>
            <input
              type="radio"
              name={`loopmode_${index}`}
              value="count"
              checked={mode==='count'}
              onChange={handleModeChange}
            />
            Count-Based
          </label>
          <label>
            <input
              type="radio"
              name={`loopmode_${index}`}
              value="condition"
              checked={mode==='condition'}
              onChange={handleModeChange}
            />
            Condition-Based
          </label>
        </div>
      </div>
      <div className="loop-instruct-lines">
        {loopInstructLines.map((line, i) => (
          <InstructLine
            key={i}
            index={i}
            data={line}
            updateInstructLine={updateLoopLine}
          />
        ))}
        <button onClick={addLoopLine} className="add-loop-line-button">
          Add Loop Instruct Line
        </button>
      </div>
    </div>
  );
}

export default LoopSegment;
