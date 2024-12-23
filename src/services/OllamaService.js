// src/services/OllamaService.js

import {
  buildSPPrompt
} from './SummarizationAndPromptService';
import {
  analyzeEthicalConcerns,
  applyEthicalRevisions
} from './EthicalGuardService';
import {
  analyzeCulturalSensitivity,
  integrateCulturalFeedback
} from './CulturalAdvisorService';
import { selectSPModel } from './ModelRouterService';

const baseURL = `${process.env.REACT_APP_OLLAMA_URL || 'http://localhost:11434'}/api/generate`;

/**
 * ollamaRunStream
 * Streams the AI model's response from Ollama as an async generator.
 */
async function* ollamaRunStream(model, prompt, signal) {
  const body = { model, prompt };
  const res = await fetch(baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama server error: ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  let errorMsg = null;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (streamDone) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(l => l.trim() !== '');
    for (const line of lines) {
      let obj;
      try {
        obj = JSON.parse(line);
      } catch (err) {
        console.error('Error parsing line from Ollama:', line, err);
        continue;
      }
      if (obj.error) {
        errorMsg = obj.error;
      }
      if (obj.response) {
        yield obj.response;
      }
      if (obj.done) {
        done = true;
        break;
      }
    }
  }
  if (errorMsg) {
    throw new Error(`Ollama inference error: ${errorMsg}`);
  }
}

/**
 * runOllamaCommand
 * e.g. /clear on the chosen model.
 */
async function runOllamaCommand(model, command, signal) {
  for await (const _ of ollamaRunStream(model, command, signal)) {
    // no output expected
  }
}

/**
 * runSPInference
 * Summarization & Prompt inference
 */
async function runSPInference(spModel, spParams, signal, onChar, onDone) {
  try {
    const spPrompt = await buildSPPrompt(spParams);
    for await (const chunk of ollamaRunStream(spModel, spPrompt, signal)) {
      for (const ch of chunk) {
        onChar(ch);
      }
    }
    onDone();
  } catch (error) {
    console.error('[runSPInference] Error:', error);
    onDone(); // finalize
  }
}

/**
 * runMainInference
 * Main persona response.
 */
async function runMainInference(chosenModel, mainPrompt, signal, onChar, onDone) {
  try {
    let ethicalFeedback = analyzeEthicalConcerns(mainPrompt);
    if (ethicalFeedback) {
      mainPrompt = applyEthicalRevisions(mainPrompt);
    }
    let culturalFeedback = analyzeCulturalSensitivity(mainPrompt);
    let finalPrompt = integrateCulturalFeedback(mainPrompt, culturalFeedback);

    for await (const chunk of ollamaRunStream(chosenModel, finalPrompt, signal)) {
      for (const ch of chunk) {
        onChar(ch);
      }
    }
    onDone();
  } catch (error) {
    console.error('[runMainInference] Error:', error);
    onDone();
  }
}

/**
 * processInstructLine
 * Given an instruct line from the IS Schema, runs S&P then the main inference.
 */
export async function processInstructLine(
  spModel,
  line,
  signal,
  onSPChar,
  onSPDone,
  onMainChar,
  onMainDone
) {
  // Build S&P prompt
  const spParams = {
    biggerPlan: 'Larger plan context placeholder.',
    threadSummary: 'Thread summary placeholder.',
    userInstructions: `Persona ${line.persona} instructions: ${line.instructText}`,
    selectedModel: spModel // e.g. 'qwq:latest'
  };

  // 1) Summarization & Prompt
  await runSPInference(spModel, spParams, signal, onSPChar, onSPDone);

  // 2) Main Inference: we use line.model if it’s present
  let chosenModel = line.model || spModel;
  try {
    await runOllamaCommand(chosenModel, '/clear', signal);
  } catch (error) {
    console.error('[processInstructLine] Could not clear context:', error);
  }

  const mainPrompt = `
## Persona: ${line.persona}
Now respond according to the instructions:
${line.instructText}
`.trim();

  await runMainInference(chosenModel, mainPrompt, signal, onMainChar, onMainDone);
}

