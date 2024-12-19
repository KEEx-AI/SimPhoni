// src/services/O1Service.js

// Replace this with the EXACT Function URL shown after a successful deploy.
// Example given: https://callopenai-kj2odp75ga-uc.a.run.app
// Make sure no typos or extra characters.
const CLOUD_FUNCTION_URL = 'https://callopenai-kj2odp75ga-uc.a.run.app';

export async function getO1ResearchDemo() {
  const prompt = `
    Consider the year 2045: Quantum computing has merged with advanced bioengineering and decentralized AI-driven energy grids to transform every sector of society. Provide a strategic, interdisciplinary research roadmap:

    1. Identify top three breakthrough applications at the intersection of quantum computing, bioengineering, and AI-driven energy grids.
    2. Outline key global stakeholders and potential roles.
    3. Present a 10-year timeline of emerging research frontiers, major milestones.
    4. Discuss societal, ethical, and regulatory challenges with mitigation strategies.
    5. Suggest collaborative frameworks and knowledge-sharing to foster continuous innovation.

    The result should be a visionary, yet practical guide, bridging theory, implementation, and policy planning. Make it concise but deeply thought-provoking.
  `;

  const response = await fetch(CLOUD_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to call O1 function:", text);
    throw new Error('Failed to load O1 research demo');
  }

  const data = await response.json();
  return data.result;
}
