// functions/callOpenAI.js
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { OpenAI } = require('openai');

// Define the secret for the OpenAI API Key
const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');

// For debugging CORS, let's allow all origins. Once confirmed, you can restrict to http://localhost:3000
exports.callOpenAI = onRequest({
  region: 'us-central1',
  secrets: [OPENAI_API_KEY],
}, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY.value(),
  });

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing "prompt" field in request body.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-o1',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const resultText = completion.choices[0].message.content;
    return res.status(200).json({ result: resultText });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
