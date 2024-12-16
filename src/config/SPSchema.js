// src/config/SPSchema.js
export const SPSchema = {
  instructions: "Use this schema to structure and summarize prompts effectively before inference.",
  fields: [
    { name: "summary", type: "string", required: false },
    { name: "prompt", type: "string", required: true }
  ]
};
