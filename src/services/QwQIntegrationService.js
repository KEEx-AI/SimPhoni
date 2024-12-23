// src/services/QwQIntegrationService.js

export const QWQ_MAX_CONTEXT = 32000;

export const QWQ_RECOMMENDATIONS = {
  scientific: [
    "Use QwQ for complex scientific data analysis and simulations.",
    "Leverage its large context window for comprehensive literature reviews."
  ],
  mathematical: [
    "Utilize QwQ’s math reasoning for proofs and complex problem sets.",
    "Break down problems step-by-step."
  ],
  programming: [
    "Use QwQ to generate and debug code snippets.",
    "Pair with developer feedback for optimization."
  ],
  ethics: [
    "Apply QwQ for exploring scenario-based ethical dilemmas with multiple perspectives."
  ],
  creative: [
    "QwQ can assist in conceptual frameworks, though might need a creative model for final polish."
  ],
};

/**
 * applyQwQTips
 * Insert domain-specific best practices into the prompt.
 */
export function applyQwQTips(instructions, domain='scientific') {
  const tips = QWQ_RECOMMENDATIONS[domain] || [];
  if (tips.length === 0) return instructions;
  return `${instructions}\n\n[QwQ BEST PRACTICES FOR ${domain.toUpperCase()}]\n- ${tips.join('\n- ')}\n`;
}
