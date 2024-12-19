// src/services/OllamaService.js
import { buildSPPrompt } from './SummarizationAndPromptService';

const baseURL = 'http://localhost:11434/api/generate';

async function* ollamaRunStream(model, prompt, signal) {
  const body = { model, prompt };
  const res = await fetch(baseURL, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
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

  while(!done) {
    const {value, done:streamDone} = await reader.read();
    if (streamDone) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(l => l.trim() !== '');
    for (const line of lines) {
      let obj;
      try {
        obj = JSON.parse(line);
      } catch (err) {
        console.error("Error parsing Ollama line:", line, err);
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

function personaStyle(personaNickname) {
  if (!personaNickname) return '';
  const styles = {
    'Wizard': 'Use mystical metaphors and poetic language.',
    'Engineer': 'Focus on technical details, step-by-step logic.',
    'Scientist': 'Rely on data, evidence, and structured analysis.',
    'Policy Maker': 'Emphasize policy frameworks, international cooperation.',
    'Artist': 'Use creative and inspiring imagery.',
    'Teacher': 'Explain concepts simply, educational tone.',
    'Hero': 'Brave, action-oriented, solution-focused language.',
    'Member': 'Advisory tone, balanced perspective.',
  };
  const keys = Object.keys(styles);
  for (let k of keys) {
    if (personaNickname && personaNickname.toLowerCase().includes(k.toLowerCase())) {
      return styles[k];
    }
  }
  return 'Speak with clarity and distinct personality.';
}

async function runOllamaCommand(model, command, signal) {
  // Simple function to run a single command like "/clear"
  for await (const _ of ollamaRunStream(model, command, signal)) {
    // We don't expect output from /clear, but if it does respond, ignore.
  }
}

export async function processInstructLine(
  spModel,
  line,
  signal,
  onSPChar,
  onSPDone,
  onMainChar,
  onMainDone
) {
  const personaDescriptor = personaStyle(line.persona);
  const spPrompt = buildSPPrompt({
    biggerPlan:"Larger plan context placeholder: Always remember we have a multi-step process and we must keep continuity.",
    threadSummary:"Thread summary placeholder: Summarize what has happened so far, focusing on relevant context.",
    userInstructions: `Persona ${line.persona} instructions: ${line.instructText}\nPersona Style: ${personaDescriptor}`
  });

  // Stream S&P
  for await (const spLine of ollamaRunStream(spModel, spPrompt, signal)) {
    for (const ch of spLine) {
      onSPChar(ch);
    }
  }
  onSPDone();

  const chosenModel = await deriveModelFromPersona(line.persona);

  // Clear context before main inference
  await runOllamaCommand(chosenModel, "/clear", signal);

  const personaLabel = `[Inference(${line.persona}:${chosenModel})]:\n`;
  for (const ch of personaLabel) {
    onMainChar(ch);
  }

  // Main prompt with persona style
  const mainPrompt = `${spPrompt}\n\nNow ${line.persona} responds using their unique style:\n${personaDescriptor}\nUser Instructions:${line.instructText}`;

  for await (const mainLine of ollamaRunStream(chosenModel, mainPrompt, signal)) {
    for (const ch of mainLine) {
      onMainChar(ch);
    }
  }
  onMainDone();
}

async function deriveModelFromPersona(personaNickname) {
  return "llama3.2:3b";
}

export async function checkLoopCondition() {
  return false;
}
