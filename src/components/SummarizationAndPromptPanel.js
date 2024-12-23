// src/services/SummarizationAndPromptService.js

import { buildPromptFromTemplate, defaultPromptTemplate } from './PromptTemplateService';
import { applyQwQTips } from './QwQIntegrationService';
import { getModelProfile } from './ModelProfileService';

/**
 * buildSPPrompt
 * Constructs a dynamic, context-rich prompt, including optional persona arrays, global notes,
 * style guidelines, additional steps, schema details, and model profiling.
 *
 * @param {object} params - The parameters for prompt construction.
 * @param {string} params.biggerPlan - The ~200-word high-level strategic plan.
 * @param {string} params.threadSummary - The ~400-word context or state of the current thread.
 * @param {string} params.userInstructions - Specific user instructions for the AI model.
 * @param {string} [params.personaInstructions=''] - Detailed persona arrays or style frameworks.
 * @param {string} [params.globalNotes=''] - Additional context such as cultural sensitivity, ethics, multilingual notes.
 * @param {string} [params.styleGuidelines=''] - Desired tone, formatting preferences, or creative constraints.
 * @param {string} [params.additionalSteps=''] - Extra instructions or iterative improvement steps.
 * @param {string} [params.isSchemaDetails=''] - Serialized representation of the entire IS Schema (personas, instruct lines).
 * @param {string} [params.qwqDomain='scientific'] - The domain context for QwQ tips (e.g., 'scientific', 'mathematical').
 * @param {string} [params.selectedModel='QwQ'] - The AI model selected for inference (defaulting to QwQ).
 *
 * @returns {string} - The constructed prompt.
 */
export async function buildSPPrompt({
  biggerPlan = "Larger plan context placeholder.",
  threadSummary = "Thread summary placeholder.",
  userInstructions,
  personaInstructions = '',
  globalNotes = '',
  styleGuidelines = '',
  additionalSteps = '',
  isSchemaDetails = '',
  qwqDomain = 'scientific',
  selectedModel = 'QwQ'
}) {
  // Retrieve model profile (optional, if you have a ModelProfileService in place)
  const modelProfile = getModelProfile(selectedModel);

  // Construct model briefing section
  let modelBriefing = '';
  if (modelProfile) {
    modelBriefing = `
[Model Briefing: ${selectedModel}]
**Strengths:**
- ${modelProfile.strengths.join('\n- ')}
**Weaknesses:**
- ${modelProfile.weaknesses.join('\n- ')}
**Ideal Use Cases:**
- ${modelProfile.idealUseCases.join('\n- ')}
**Limitations:**
- ${modelProfile.limitations.join('\n- ')}
`;
  }

  // Apply QwQ tips based on domain
  const qwqDomainTips = applyQwQTips('', qwqDomain);

  const data = {
    biggerPlan,
    threadSummary,
    globalNotes,
    personaInstructions,
    userInstructions,
    additionalSteps,
    styleGuidelines,
    isSchemaDetails,
    qwqDomainTips,
    modelBriefing
  };

  // Use a template-driven approach to build the final prompt
  const prompt = buildPromptFromTemplate(defaultPromptTemplate, data);

  return prompt;
}

/**
 * checkLoopCondition
 * Analyze recent AI responses to determine if iterative refinement is needed.
 *
 * @param {string} responseText - The AI model's response text.
 * @returns {boolean} - Whether another iteration is needed.
 */
export async function checkLoopCondition(responseText) {
  const triggerWords = ["needs more detail", "expand further", "unclear", "elaborate", "more information"];
  const lowerResponse = responseText.toLowerCase();
  return triggerWords.some(word => lowerResponse.includes(word));
}
