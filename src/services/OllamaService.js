// src/services/OllamaService.js
import { checkLoopCondition, buildSPPrompt } from './SummarizationAndPromptService';

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
    const lines = chunk.split('\n').filter(l=>l.trim()!=='');
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
        // yield partial text lines
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

export async function processInstructLine(spModel, line, signal, onSPChar, onSPDone, onMainChar, onMainDone) {
  // 1. Run S&P model
  const spPrompt = buildSPPrompt({
    biggerPlan:"Larger plan context placeholder...",
    threadSummary:"Thread summary placeholder...",
    userInstructions: line.instructText
  });

  for await (const spLine of ollamaRunStream(spModel, spPrompt, signal)) {
    // spLine is a chunk of text
    // Add characters one by one
    for (const ch of spLine) {
      onSPChar(ch);
    }
  }
  onSPDone();

  // 2. Determine model
  const chosenModel = await deriveModelFromPersona(line.persona);
  // Add a header line first?
  const header = `[Inference(${chosenModel})]:\n`;
  for (const ch of header) {
    onMainChar(ch);
  }

  for await (const mainLine of ollamaRunStream(chosenModel, spPrompt, signal)) {
    for (const ch of mainLine) {
      onMainChar(ch);
    }
  }
  onMainDone();
}

async function deriveModelFromPersona(personaNickname) {
  if (personaNickname === 'Wizard') return 'phi3:14b-medium-128k-instruct-fp16';
  if (personaNickname === 'Engineer') return 'llama3.2:3b';
  return 'llama3.2:3b';
}

export async function processAllInstructLines(lines, spModel, signal, onSPChar, onSPDone, onMainChar, onMainDone) {
  // This is a helper if needed, but we'll handle iteration in ISThread.js
  for (const line of lines) {
    if (line.type === 'instruct') {
      await processInstructLine(spModel, line, signal, onSPChar, onSPDone, onMainChar, onMainDone);
    } else if (line.type === 'loop') {
      if (line.mode === 'count') {
        for (let i=0; i<line.iterations; i++) {
          await processAllInstructLines(line.instructLines, spModel, signal, onSPChar, onSPDone, onMainChar, onMainDone);
        }
      } else {
        let continueLoop = true;
        while (continueLoop) {
          await processAllInstructLines(line.instructLines, spModel, signal, onSPChar, onSPDone, onMainChar, onMainDone);
          continueLoop = await checkLoopCondition("condition prompt here", spModel);
          if (!continueLoop) break;
        }
      }
    }
  }
}
