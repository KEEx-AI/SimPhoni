// src/services/SummarizationAndPromptService.js

/**
 * SummarizationAndPromptService.js
 * --------------------------------
 * This version applies more nuanced transformations to user instructions
 * and can optionally do domain-specific or persona-specific rewriting.
 */

import { applyQwQTips } from './QwQIntegrationService';
import { getModelProfile } from './ModelProfileService';

export async function buildSPPrompt({
  biggerPlan = '',
  threadSummary = '',
  userInstructions = '',
  personaNickname = '',     // optional, if you want persona-based rewriting
  globalNotes = '',
  styleGuidelines = '',
  additionalSteps = '',
  isSchemaDetails = '',
  qwqDomain = 'scientific',
  selectedModel = 'qwq'
}) {
  // Retrieve optional model info
  const modelProfile = getModelProfile(selectedModel);
  
  // Potential persona or domain-based transformations
  const refinedInstructions = refineInstructions(userInstructions, personaNickname, qwqDomain);

  // Possibly inject best practices for QwQ
  const qwqDomainTips = applyQwQTips('', qwqDomain);

  // Build your combined prompt
  const prompt = `
[Step 1: Larger Plan (~200 words)]
${biggerPlan || "No larger plan provided."}

[Step 2: Thread Context (~400 words)]
${threadSummary || "No thread summary provided."}

[Step 3: Global Notes]
${globalNotes}

[Step 4: Style Guidelines]
${styleGuidelines}

[Step 5: Specific User Instructions (Optimized)]
${refinedInstructions}

[Step 6: Additional Steps]
${additionalSteps}

[Step 7: IS Schema Details]
${isSchemaDetails}

[Step 8: QwQ Domain Tips]
${qwqDomainTips}

[Step 9: Model Profile (Optional)]
${
  modelProfile ? `Strengths: ${modelProfile.strengths.join(', ')}\nWeaknesses: ${modelProfile.weaknesses.join(', ')}` : 'No specific model profile.'
}

Please use the above instructions to generate a high-quality summary and prompt.
  `.trim();

  return prompt;
}

/**
 * refineInstructions
 * Performs textual modifications to user instructions:
 *  - Removes filler words
 *  - Shortens run-ons
 *  - Does persona- or domain-based rewriting (if desired)
 */
function refineInstructions(text, personaNickname, qwqDomain) {
  if (!text) return '';

  let output = text;

  // Simple example: remove polite or extraneous phrases
  const fillerRegex = /\b(please|kindly|I want you to|I want|could you)\b/gi;
  output = output.replace(fillerRegex, '').trim();

  // Example domain-based tweak: If domain is "scientific", prefer bullet points
  if (qwqDomain === 'scientific') {
    // If instructions are fairly long, break them up
    if (output.length > 100) {
      output = output.replace(/\.\s+/g, '.\n- '); // Turn sentences into bullet points
      output = '- ' + output; // start with a bullet
    }
  }

  // Optional: If persona is "DataScientist", do an additional pass, etc.
  if (personaNickname.toLowerCase().includes('datascientist')) {
    output = `[DataScience Enhanced] ${output}`;
  }

  return output;
}
