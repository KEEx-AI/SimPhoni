// src/services/PromptTemplateService.js

export const defaultPromptTemplate = {
  steps: [
    { label: "Step 1: Larger Plan (~200 words)", key: "biggerPlan" },
    { label: "Step 2: Thread Context (~400 words)", key: "threadSummary" },
    { label: "Step 3: Global/Contextual Notes", key: "globalNotes", optional: true },
    { label: "Step 4: Persona and Style Guidelines", key: "personaInstructions", optional: true },
    { label: "Step 5: Specific User Instructions", key: "userInstructions", optional: false },
    { label: "Step 6: Additional Steps / Instructions", key: "additionalSteps", optional: true },
    { label: "Step 7: Style Preferences and Creativity Notes", key: "styleGuidelines", optional: true },
    { label: "Step 8: IS Schema Details", key: "isSchemaDetails", optional: true },
    { label: "Step 9: QwQ Domain Tips", key: "qwqDomainTips", optional: true },
    { label: "Step 10: Model Briefing", key: "modelBriefing", optional: true }
  ],
  footer: "Please use the above instructions to generate a high-quality summary and prompt."
};

export function buildPromptFromTemplate(template, data) {
  let prompt = "";
  for (const step of template.steps) {
    const content = data[step.key];
    if (!content && step.optional) continue;
    const finalContent = content || `No ${step.key} provided.`;
    prompt += `[${step.label}]\n${finalContent}\n\n`;
  }
  prompt += template.footer;
  return prompt;
}
