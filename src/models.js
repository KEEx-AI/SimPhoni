// src/models.js

export const allModels = [
  { name: 'qwen2.5:0.5b', display: 'qwen2.5:0.5b [ExtremelyFast, <100wordsRecommended, BasicIntelligence]' },
  { name: 'llama3.2:1b', display: 'llama3.2:1b [VeryFast]' },
  { name: 'llama3.2:3b', display: 'llama3.2:3b [Fast, Versatile]' },
  { name: 'qwen2.5:7b', display: 'qwen2.5:7b [Quick, 128kContext]' },
  { name: 'snowflake-arctic-embed2', display: 'snowflake-arctic-embed2 []' },
  { name: 'mistral-nemo', display: 'Mistral-Nemo:12b [Quick, 100kContext]' },
  { name: 'solor-pro', display: 'solor-pro (22b) [EfficientMathScienceModel]' },
  { name: 'wizard-vicuna-uncensored:30b', display: 'wizard-vicuna-uncensored:30b, 4kContext' },
  { name: 'nous-hermes2:34b', display: 'nous-hermes2:34b [MediumIntelligence, MediumSpeed]' },
  { name: 'nemotron:70b', display: 'nemotron:70b [HighIntelligence, Slow]' },
  { name: 'codellama:70b', display: 'codellama:70b [HighIntelligence, Slow]' },
  { name: 'phi3:medium-128k', display: 'phi3:medium-128k (14b) MediumIntelligence, MediumSpeed, 128kContext' },
  { name: 'phi3:14b-medium-128k-instruct-fp16', display: 'phi3:14b-medium-128k-instruct-fp16 [Medium(+)Intelligence, 128kContext, Slow]' },
  { name: 'llama3.3:70b', display: 'llama3.3:70b [MostIntelligent, 128kContext, Slow]' },
  // QwQ with no ":latest" suffix:
  { name: 'qwq', display: 'QwQ [Reasoning, 32kContext]' }
];

export const spModels = [
  { name: 'qwq', display: 'QwQ [Default]' },
  { name: 'phi3:14b-medium-128k-instruct-fp16', display: 'phi3:14b-medium-128k-instruct-fp16 [Fallback]' },
  { name: 'llama3.3:70b', display: 'llama3.3:70b' },
  { name: 'qwen2.5:7b', display: 'qwen2.5:7b' }
];
