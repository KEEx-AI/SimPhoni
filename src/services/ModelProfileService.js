// src/services/ModelProfileService.js

const modelProfiles = {
  'llama3.2:1b': {
    strengths: ['High efficiency', 'Good for quick summaries'],
    weaknesses: ['Limited reasoning depth'],
    idealUseCases: ['Basic filtering', 'Short summaries'],
    limitations: ['Struggles with complex tasks']
  },
  'QwQ': {
    strengths: [
      'Advanced cross-domain reasoning',
      'Great at graduate-level scientific analysis, math problems, coding tasks',
      '32k token context window'
    ],
    weaknesses: [
      'Occasional recursive reasoning loops',
      'Language mixing and some common sense gaps'
    ],
    idealUseCases: [
      'Chief Reasoner persona',
      'Complex research synthesis',
      'Deep iterative refinement and multi-domain tasks'
    ],
    limitations: [
      'Needs oversight for ethical/cultural consistency',
      'Slower inference due to model size'
    ]
  },
  // ... add profiles for other models similarly ...
};

/**
 * getModelProfile
 * @param {string} modelName
 * @returns {object|null}
 */
export function getModelProfile(modelName) {
  return modelProfiles[modelName] || null;
}

/**
 * listAllModels
 * @returns {Array<string>}
 */
export function listAllModels() {
  return Object.keys(modelProfiles);
}
