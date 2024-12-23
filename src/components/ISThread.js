// src/components/ISThread.js
import React, { useState, useEffect, useRef } from 'react';
import './ISThread.css';
import HeaderButtons from './HeaderButtons';
import { useAppData } from '../context/AppContext';
import { processInstructLine } from '../services/OllamaService';
import { saveTextFile } from '../services/FileService';

function ISThread() {
  const { instructLines = [], selectedSPModel } = useAppData();

  // Use 'qwq' as the default S&P model if user hasn't selected one
  const defaultSPModel = 'qwq';
  const spModelToUse = selectedSPModel || defaultSPModel;

  const [errorMessage, setErrorMessage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const abortControllerRef = useRef(null);

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (instructLines && instructLines.length > 0) {
      startSequence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructLines]);

  async function startSequence() {
    setIsRunning(true);
    setErrorMessage(null);
    setEntries([]);
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < instructLines.length; i++) {
        await processSingleInstructLine(instructLines[i], i);
      }
    } catch (error) {
      console.error("Error during sequence execution:", error);
      setErrorMessage(error.message || 'Error during inference');
    } finally {
      setIsRunning(false);
    }
  }

  async function processSingleInstructLine(line, lineIndex) {
    // Initialize an S&P entry in the UI
    setEntries((prev) => [
      ...prev,
      { type: 'sp', text: '', expanded: true, lineIndex }
    ]);

    await processInstructLine(
      spModelToUse,
      line,
      abortControllerRef.current.signal,
      // onSPChar
      (ch) => onSPChar(lineIndex, ch),
      // onSPDone
      () => onSPDone(lineIndex),
      // onMainChar
      (ch) => onMainChar(lineIndex, ch),
      // onMainDone
      () => onMainDone(lineIndex)
    );
  }

  const onSPChar = (lineIndex, ch) => {
    setEntries((prev) => {
      const newArr = [...prev];
      const idx = newArr.findIndex((e) => e.type === 'sp' && e.lineIndex === lineIndex);
      if (idx > -1) {
        newArr[idx].text += ch;
      }
      return newArr;
    });
  };

  const onSPDone = (lineIndex) => {
    // Summarization & Prompt step done
  };

  const onMainChar = (lineIndex, ch) => {
    setEntries((prev) => {
      const newArr = [...prev];
      let mainIndex = newArr.findIndex((e) => e.type === 'main' && e.lineIndex === lineIndex);

      // If we haven't created a 'main' entry yet, do so
      if (mainIndex === -1) {
        newArr.push({ type: 'main', text: '', lineIndex });
        mainIndex = newArr.length - 1;
        // Optionally collapse the sp entry
        const spIndex = newArr.findIndex((e) => e.type === 'sp' && e.lineIndex === lineIndex);
        if (spIndex > -1) {
          newArr[spIndex].expanded = false;
        }
      }
      newArr[mainIndex].text += ch;
      return newArr;
    });
  };

  const onMainDone = (lineIndex) => {
    // Main inference done
  };

  const reRunSequence = () => {
    if (instructLines && instructLines.length > 0) {
      startSequence();
    } else {
      setErrorMessage("No instruct lines available to re-run.");
    }
  };

  const terminateSequence = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      // Provide feedback in UI
      setEntries((prev) => [
        ...prev,
        { type: 'main', text: '(Terminated by user)', lineIndex: 9999 }
      ]);
    }
  };

  const saveInferenceSequence = async () => {
    let spCounter = 1;
    let mainCounter = 1;
    let spText = '';
    let mainText = '';

    entries.forEach((e) => {
      if (e.type === 'sp') {
        spText += `[S&P Entry ${spCounter++}]\n${e.text}\n`;
      } else if (e.type === 'main') {
        mainText += `[Inference Output ${mainCounter++}]\n${e.text}\n`;
      }
    });

    const combined = `=== Summarization & Prompt Outputs ===\n${spText}\n=== Inference Outputs ===\n${mainText}\n`;
    await saveTextFile(combined, "InferenceSequence.txt");
  };

  const toggleSP = (lineIndex) => {
    setEntries((prev) => {
      const newArr = [...prev];
      const spIndex = newArr.findIndex((e) => e.type === 'sp' && e.lineIndex === lineIndex);
      if (spIndex > -1) {
        newArr[spIndex].expanded = !newArr[spIndex].expanded;
      }
      return newArr;
    });
  };

  return (
    <div className="is-thread-layout">
      <div className="thread-header">
        <HeaderButtons
          mainButtonLabel="RE-RUN SEQUENCE"
          mainButtonColor="#FF007C"
          onSecondaryButtonClick={() => {}}
          setCurrentPage={reRunSequence}
          pageTitle="Inference Sequence"
        />
        <div className="thread-controls">
          <button className="terminate-button" onClick={terminateSequence}>
            Terminate Process
          </button>
          {!isRunning && entries.length > 0 && (
            <button className="save-button" onClick={saveInferenceSequence}>
              Save Inference Sequence
            </button>
          )}
        </div>
      </div>

      <div className="thread-results">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {isRunning && entries.length === 0 && (
          <div className="info-message">Running Inference...</div>
        )}
        {!isRunning && entries.length === 0 && !errorMessage && (
          <div className="info-message">
            No inference results yet. Run a sequence to see outputs.
          </div>
        )}

        {entries.map((e, i) => (
          <div key={`${e.type}_${e.lineIndex}_${i}`} className={`entry ${e.type}`}>
            {e.type === 'sp' && (
              <div className="sp-box">
                <div className="sp-header" onClick={() => toggleSP(e.lineIndex)}>
                  <span
                    className="toggle-arrow"
                    style={{ color: 'pink', cursor: 'pointer' }}
                  >
                    {e.expanded ? '▼' : '▶'}
                  </span>
                  {' '}S&P Entry {e.lineIndex + 1}
                </div>
                {e.expanded && (
                  <div className="sp-content">
                    <pre>{e.text}</pre>
                  </div>
                )}
              </div>
            )}
            {e.type === 'main' && (
              <div className="main-box">
                <pre>{e.text}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ISThread;
