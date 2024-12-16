// src/services/SummarizationAndPromptService.js
export function buildSPPrompt({ biggerPlan, threadSummary, userInstructions }) {
  return `
[Step 1: Larger Plan ~200 words]
${biggerPlan}

[Step 2: Thread Context ~400 words]
${threadSummary}

[Step 3: Specific User Instructions]
${userInstructions}

Please carry out the above instructions using the chosen inference model.
`;
}

export async function checkLoopCondition(prompt, spModel='phi3:14b-medium-128k-instruct-fp16') {
  // Mock returns false
  return false;
}
