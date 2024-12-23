/*************************************/
/* app.mjs (ES Modules + Caching)    */
/*************************************/
import express from 'express';
import fetch from 'node-fetch';
import { load } from 'cheerio';    // Named import from cheerio
import pLimit from 'p-limit';

const app = express();
app.use(express.json());

// In-memory cache for scraped pages
const scrapeCache = new Map();

// Limit concurrency to 2 scrape tasks at a time
const limit = pLimit(2);

/**
 * Perform a DuckDuckGo search (basic approach)
 */
async function performWebSearch(query, numResults = 3) {
  const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await fetch(searchUrl);
  const html = await response.text();

  // Use the named `load` function from cheerio
  const $ = load(html);

  const results = [];
  $('a.result__a').each((index, element) => {
    if (index < numResults) {
      const title = $(element).text();
      const url = $(element).attr('href');
      results.push({ title, url });
    }
  });

  return results;
}

/**
 * Scrape text from a page, with caching
 */
async function scrapePageText(url) {
  const cacheEntry = scrapeCache.get(url);
  const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes
  const now = Date.now();

  // If cached & not expired, return cached text
  if (cacheEntry && now - cacheEntry.lastFetched < CACHE_DURATION) {
    console.log(`Using cached result for: ${url}`);
    return cacheEntry.text;
  }

  // Otherwise, fetch fresh data
  try {
    console.log(`Scraping fresh content from: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    let textContent = '';
    $('p').each((_, p) => {
      textContent += $(p).text() + '\n';
    });

    scrapeCache.set(url, { text: textContent, lastFetched: now });
    return textContent;
  } catch (err) {
    console.error(`Failed to scrape ${url} =>`, err);
    return '';
  }
}

/**
 * Send prompt to local Ollama
 */
async function sendToOllama(prompt, modelName = 'llama3.3') {
  try {
    const ollamaUrl = 'http://localhost:11411/v1/complete';
    const body = {
      prompt,
      model: modelName,
      // Additional Ollama parameters optional
    };

    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    // Ollama returns an array of { "completion": string } chunks
    const data = await response.json();

    let completion = '';
    data.forEach(chunk => {
      if (chunk.completion) {
        completion += chunk.completion;
      }
    });

    return completion.trim();
  } catch (err) {
    console.error('Error contacting Ollama:', err);
    throw err;
  }
}

/**
 * Simple test route
 */
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Ollama Summarizer v2!' });
});

/**
 * Main route: /api/search-and-summarize
 * Expects { query, modelName? }
 */
app.post('/api/search-and-summarize', async (req, res) => {
  const { query, modelName = 'llama3.3' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing required "query" field.' });
  }

  try {
    // (A) Search
    const searchResults = await performWebSearch(query, 3);

    // (B) Scrape each page, with concurrency limit
    const tasks = searchResults.map(result =>
      limit(async () => {
        const text = await scrapePageText(result.url);
        return { ...result, text };
      })
    );
    const scrapedData = await Promise.all(tasks);

    // (C) Aggregate text
    let aggregatedText = '';
    for (const item of scrapedData) {
      aggregatedText += `
Source Title: ${item.title}
URL: ${item.url}

${item.text}
`;
    }

    // (D) Construct prompt
    const prompt = `
Below is information from web search results about "${query}".
Please provide a concise, accurate, and thorough summary.
Note any conflicting or unclear info.

Information:
${aggregatedText}

Summary:
`;

    // (E) Send to Ollama
    const summary = await sendToOllama(prompt, modelName);

    // (F) Return response
    return res.json({
      query,
      modelName,
      summary
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'An error occurred while processing the request.'
    });
  }
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Try GET http://localhost:${PORT}/api/hello to test!`);
});
