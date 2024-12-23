// src/components/InferenceSequenceBuilder.js
import React, { useState } from 'react';
import { processInstructLine } from '../services/OllamaService';
import { flattenInstructLines } from '../services/flattenInstructSchema';
import './InferenceSequenceBuilder.css';

const InferenceSequenceBuilder = ({ schema }) => {
  // By default, let's pick 'qwq' instead of 'qwq-latest'
  const [spModel, setSpModel] = useState('qwq');
  const [inferenceLogs, setInferenceLogs] = useState([]);

  const handleStartSequence = async () => {
    setInferenceLogs([]);
    console.log("[InferenceSequenceBuilder] Starting sequence with S&P model:", spModel);

    const lines = schema?.instructLines || [];
    if (!Array.isArray(lines) || lines.length === 0) {
      console.warn("No instructLines found in schema or it's empty.");
      return;
    }

    const expanded = flattenInstructLines(lines);
    console.log("[InferenceSequenceBuilder] Flattened lines:", expanded);

    const abortController = new AbortController();
    const signal = abortController.signal;

    for (let i = 0; i < expanded.length; i++) {
      const line = expanded[i];
      try {
        await processInstructLine(
          spModel,
          line,
          signal,
          // S&P char callback
          (ch) => setInferenceLogs((prev) => [
            ...prev,
            { type: 'S&P', persona: line.persona, char: ch }
          ]),
          // S&P done callback
          () => setInferenceLogs((prev) => [
            ...prev,
            { type: 'S&P', persona: line.persona, done: true }
          ]),
          // Main char callback
          (ch) => setInferenceLogs((prev) => [
            ...prev,
            { type: 'Main', persona: line.persona, char: ch }
          ]),
          // Main done callback
          () => setInferenceLogs((prev) => [
            ...prev,
            { type: 'Main', persona: line.persona, done: true }
          ])
        );
      } catch (error) {
        console.error("[InferenceSequenceBuilder] Error in line iteration:", error);
        setInferenceLogs((prev) => [
          ...prev,
          { type: 'Error', persona: line.persona, error: error.message }
        ]);
        // If you prefer to stop after the first error, uncomment:
        // break;
      }
    }
  };

  return (
    <div className="inference-sequence-builder">
      <h2>Inference Sequence (Debug Mode)</h2>

      <div>
        <label>S&P Model:</label>
        <select value={spModel} onChange={(e) => setSpModel(e.target.value)}>
          {/* Use the updated list of local models */}
          <option value="qwq">QwQ [default]</option>
          <option value="nemotron:70b">nemotron:70b</option>
          <option value="wizard-vicuna-uncensored:30b">wizard-vicuna-uncensored:30b</option>
          <option value="nous-hermes2:34b">nous-hermes2:34b</option>
          <option value="phi3:14b-medium-128k-instruct-fp16">phi3:14b-medium-128k-instruct-fp16</option>
          <option value="solor-pro">solor-pro</option>
          <option value="qwen2.5:7b">qwen2.5:7b</option>
        </select>
        <button onClick={handleStartSequence}>Start Sequence</button>
      </div>

      <div className="inference-logs">
        <h3>Inference Logs</h3>
        <div className="logs-container">
          {inferenceLogs.map((log, idx) => {
            if (log.error) {
              return (
                <div key={idx} className="log-entry Error">
                  <strong>[Error - {log.persona}]: </strong>
                  {log.error}
                </div>
              );
            }
            if (log.done) {
              return (
                <div key={idx} className={`log-entry ${log.type}`}>
                  <strong>[{log.type} - {log.persona} DONE]</strong>
                </div>
              );
            } else {
              return (
                <div key={idx} className={`log-entry ${log.type}`}>
                  <strong>[{log.type} - {log.persona}]: </strong>
                  {log.char}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default InferenceSequenceBuilder;
