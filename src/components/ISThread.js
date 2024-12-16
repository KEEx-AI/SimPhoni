// src/components/ISThread.js
import React, { useState, useEffect, useRef } from 'react';
import './ISThread.css';
import HeaderButtons from './HeaderButtons';
import { useAppData } from '../context/AppContext';
import { processAllInstructLines, processInstructLine } from '../services/OllamaService';
import SummarizationAndPromptPanel from './SummarizationAndPromptPanel';
import { saveTextFile } from '../services/FileService';

function ISThread() {
  const { instructLines, selectedSPModel } = useAppData();
  const [spOutputs, setSpOutputs] = useState([]); // Each instruct line's S&P output is one element
  const [inferenceOutputs, setInferenceOutputs] = useState([]); // Each instruct line's main output is one element
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const abortControllerRef = useRef(null);

  const currentInstructIndex = useRef(0);
  const currentPhase = useRef('SP'); // 'SP' or 'MAIN'

  useEffect(() => {
    if (instructLines.length > 0) {
      startSequence();
    }
  // eslint-disable-next-line
  }, [instructLines]);

  async function startSequence() {
    setIsRunning(true);
    setErrorMessage(null);
    setSpOutputs([]);
    setInferenceOutputs([]);
    abortControllerRef.current = new AbortController();

    try {
      await processInstructLinesSequential();
    } catch (error) {
      setErrorMessage(error.message || 'Error during inference');
    }
    setIsRunning(false);
  }

  async function processInstructLinesSequential() {
    for (let i=0; i<instructLines.length; i++) {
      await processSingleInstructLine(instructLines[i]);
    }
  }

  // For each instruct line:
  // 1. Add a new empty S&P output string
  // 2. Type out S&P output chars
  // 3. Once S&P done, add main output string and type it out
  async function processSingleInstructLine(line) {
    // Add empty entries
    setSpOutputs(prev => [...prev, '']);
    setInferenceOutputs(prev => [...prev, '']);

    const instructIndex = spOutputs.length; // since we just added one
    // We'll return promises from processInstructLine

    await processInstructLine(
      selectedSPModel,
      line,
      abortControllerRef.current.signal,
      (ch) => onSPChar(instructIndex, ch),
      () => onSPDone(instructIndex),
      (ch) => onMainChar(instructIndex, ch),
      () => onMainDone(instructIndex)
    );
  }

  const onSPChar = (index, ch) => {
    setSpOutputs(prev => {
      const newArr = [...prev];
      newArr[index] = newArr[index] + ch;
      return newArr;
    });
  };

  const onSPDone = (index) => {
    // S&P done for this instruct line
    // Just finalize, no special action needed
  };

  const onMainChar = (index, ch) => {
    setInferenceOutputs(prev => {
      const newArr = [...prev];
      newArr[index] = newArr[index] + ch;
      return newArr;
    });
  };

  const onMainDone = (index) => {
    // main done for this instruct line
    // move on to next line handled in the loop
  };

  const reRunSequence = () => {
    startSequence();
  };

  const terminateSequence = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setInferenceOutputs(prev => [...prev, '(Terminated by user)']);
    }
  };

  const saveInferenceSequence = async () => {
    let spText = '';
    spOutputs.forEach((o,i) => {
      spText += `[S&P Entry ${i+1}]\n${o}\n`
    });
    let mainText = '';
    inferenceOutputs.forEach((o,i) => {
      mainText += `[Inference Output ${i+1}]\n${o}\n`;
    });
    const combined = `=== Summarization & Prompt Outputs ===\n${spText}\n=== Inference Outputs ===\n${mainText}\n`;
    await saveTextFile(combined, "InferenceSequence.txt");
  };

  return (
    <div className="is-thread-layout">
      <div className="left-panel">
        {/* Each instruct line's S&P is one box */}
        <SummarizationAndPromptPanel spOutputs={spOutputs} />
      </div>
      <div className="is-thread-main">
        <div className="thread-header">
          <HeaderButtons
            mainButtonLabel="RE-RUN SEQUENCE"
            mainButtonColor="#FF007C"
            onSecondaryButtonClick={()=>{}}
            setCurrentPage={reRunSequence}
            pageTitle="Inference Sequence"
          />
          <div className="thread-controls">
            <button className="terminate-button" onClick={terminateSequence}>
              Terminate Process
            </button>
            {!isRunning && (spOutputs.length>0 || inferenceOutputs.length>0) && (
              <button className="save-button" onClick={saveInferenceSequence}>
                Save Inference Sequence
              </button>
            )}
          </div>
        </div>
        <div className="thread-results">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {isRunning && spOutputs.length===0 && inferenceOutputs.length===0 && (
            <div className="info-message">Running Inference...</div>
          )}
          {/* Each instruct line's main output is one box */}
          {inferenceOutputs.map((res, i) => (
            <pre key={i} className="result-line fade-in">{res}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ISThread;
