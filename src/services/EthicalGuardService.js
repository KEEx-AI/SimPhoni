// src/services/EthicalGuardService.js

export function analyzeEthicalConcerns(text) {
  const lower = text.toLowerCase();
  const harmfulKeywords = ['stereotype', 'offensive', 'privacy violation', 'discriminatory', 'harmful bias'];
  const isHarmful = harmfulKeywords.some(word => lower.includes(word));
  if (isHarmful) {
    return "Warning: Potential ethical issues detected. Reconsider or reframe content.";
  }
  return "";
}

export function applyEthicalRevisions(content) {
  // For now, just log. Future: attempt automated redactions or replacements.
  console.warn("Applying ethical revisions...");
  return content.replace(/offensive|stereotype|discriminatory/g, '***');
}
