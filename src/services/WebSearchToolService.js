// src/services/WebSearchToolService.js

export async function performWebSearch(query) {
  // Example using your local OllamaSearch server or DuckDuckGo approach
  const endpoint = 'http://localhost:3000/api/search-and-summarize'; // or similar
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) {
      throw new Error(`Web search error: ${res.statusText}`);
    }
    const data = await res.json();
    return data.summary;
  } catch (err) {
    console.error("Error performing web search:", err);
    throw err;
  }
}
