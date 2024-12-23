// src/services/ModelRouterService.js

// We remove ANY fallback logic. If QwQ fails, the sequence fails.
export const DEFAULT_SP_MODEL = 'qwq:latest';

export function selectSPModel(domain = 'scientific') {
  // If you want domain-based picking, you can do it here.
  // But if you always want QwQ for Summarization & Prompt:
  return DEFAULT_SP_MODEL;
}
