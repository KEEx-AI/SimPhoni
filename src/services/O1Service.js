// src/services/O1Service.js
const CLOUD_FUNCTION_URL = process.env.REACT_APP_O1_PROXY_URL;

export async function getO1ResearchDemo() {
  const prompt = `
    Consider the year 2045: Quantum computing has merged with advanced bioengineering...
  `;
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed proxy call: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error calling O1 function via proxy:", error);
    throw new Error("Failed to load O1 research demo.");
  }
}
