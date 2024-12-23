// src/services/personaUtils.js

export function personaStyle(personaNickname) {
  if (!personaNickname) return '';
  const styles = {
    'wizard': 'Use mystical metaphors and poetic language.',
    'engineer': 'Focus on technical details, step-by-step logic.',
    'scientist': 'Rely on data, evidence, and structured analysis.',
    'policy maker': 'Emphasize policy frameworks, international cooperation.',
    'artist': 'Use creative and inspiring imagery.',
    'teacher': 'Explain concepts simply, educational tone.',
    'hero': 'Brave, action-oriented, solution-focused language.',
    'member': 'Advisory tone, balanced perspective.',
    'chief research analyst': 'Maintain coherence across multi-domain tasks, provide deep analysis.',
    'data scientist': 'Handle large-scale data analysis and predictive modeling with precision.',
    'ethics advisor': 'Ensure all outputs adhere to ethical standards and cultural sensitivities.',
    'technical writer': 'Create detailed, clear, and precise documentation.',
    'creative strategist': 'Develop innovative and strategic solutions to research challenges.',
    'language translator': 'Provide accurate and context-aware translations across multiple languages.'
    // Add additional personas as needed
  };

  const lowerName = personaNickname?.toLowerCase() || '';
  for (let k of Object.keys(styles)) {
    if (lowerName.includes(k)) {
      return styles[k];
    }
  }
  return 'Speak with clarity and distinct personality.';
}

export function determineQwQDomain(personaNickname) {
  const lowerName = personaNickname?.toLowerCase() || '';
  if (lowerName.includes('scientist') || lowerName.includes('wizard')) {
    return 'scientific';
  } else if (lowerName.includes('engineer') || lowerName.includes('programmer')) {
    return 'programming';
  } else if (lowerName.includes('economist')) {
    return 'mathematics';
  } else if (lowerName.includes('policy')) {
    return 'ethics';
  } else {
    return 'scientific'; // Default domain
  }
}
