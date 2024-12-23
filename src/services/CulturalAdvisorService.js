// src/services/CulturalAdvisorService.js

export function analyzeCulturalSensitivity(content) {
  if (content.toLowerCase().includes("local adaptation needed")) {
    return "Suggestion: Localize examples, ensure translations for key terminology.";
  }
  return "";
}

export function integrateCulturalFeedback(content, feedback) {
  if (!feedback) return content;
  return `${content}\n\n[Cultural Feedback]: ${feedback}`;
}
