// functions/index.js
const functions = require('firebase-functions');
const { admin, db } = require('./firebaseAdmin');
const fetch = require('node-fetch');
const cors = require('cors')({ origin: true });

exports.proxyO1Demo = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const prompt = req.body.prompt;
      const response = await fetch("https://callopenai-kj2odp75ga-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("O1 call failed:", text);
        return res.status(response.status).send(text);
      }

      const data = await response.json();
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).send(data);
    } catch (err) {
      console.error("Error proxying O1:", err);
      return res.status(500).send({ error: "Proxy Error" });
    }
  });
});
