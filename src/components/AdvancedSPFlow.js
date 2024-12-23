// src/components/AdvancedSPFlow.js
import React, { useState } from 'react';
import { buildSPPrompt } from '../services/SummarizationAndPromptService';
import { analyzeEthicalConcerns, applyEthicalRevisions } from '../services/EthicalGuardService';
import { analyzeCulturalSensitivity, integrateCulturalFeedback } from '../services/CulturalAdvisorService';
import { useAppData } from '../context/AppContext';
import './AdvancedSPFlow.css';

function AdvancedSPFlow() {
  const { instructLines, personas, arrayName } = useAppData();
  const [optimizedInstructions, setOptimizedInstructions] = useState([]);
  const [error, setError] = useState(null);

  const runOptimization = async () => {
    try {
      setError(null);
      const newOutputs = [];

      for (let i = 0; i < instructLines.length; i++) {
        const line = instructLines[i];
        // (1) Build partial S&P prompt
        const spPrompt = await buildSPPrompt({
          biggerPlan: 'Auto-optimized planning for user instructions.',
          threadSummary: 'S&P advanced flow capturing the relevant context here...',
          userInstructions: line.instructText
        });

        // (2) Optional: analyze for ethical/cultural issues
        let revised = spPrompt;
        const ethicFlag = analyzeEthicalConcerns(spPrompt);
        if (ethicFlag) {
          revised = applyEthicalRevisions(revised);
        }
        const cultureFlag = analyzeCulturalSensitivity(spPrompt);
        revised = integrateCulturalFeedback(revised, cultureFlag);

        newOutputs.push({
          original: line.instructText,
          optimized: revised.slice(0, 400) + '...' // Example: Just show a snippet
        });
      }

      setOptimizedInstructions(newOutputs);
    } catch (err) {
      setError(`Error optimizing instructions: ${err.message}`);
    }
  };

  return (
    <div className="advanced-sp-flow">
      <h2>Advanced Summarization & Prompt Flow</h2>
      <p>Array: {arrayName || "No Array Loaded"}</p>
      <button onClick={runOptimization} className="optimize-button">
        Run Instruction Optimization
      </button>
      {error && <div className="asf-error">{error}</div>}
      <div className="asf-results">
        {optimizedInstructions.map((res, idx) => (
          <div key={idx} className="asf-result-entry">
            <h4>Line {idx + 1}</h4>
            <p><strong>Original:</strong> {res.original}</p>
            <p><strong>Optimized (Snippet):</strong> {res.optimized}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvancedSPFlow;
