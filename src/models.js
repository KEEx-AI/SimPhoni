// src/models.js
export const allModels = [
  { name: 'llama3.2:1b', display: 'llama3.2:1b' },
  { name: 'llama3.2:3b', display: 'llama3.2:3b' },
  { name: 'stable-code', display: 'stable-code (3b)' },
  { name: 'mistral:7b', display: 'mistral:7b' },
  { name: 'mistral-nemo:12b', display: 'Mistral-Nemo:12b' },
  { name: 'solor-pro', display: 'solor-pro (22b)' },
  { name: 'wizard-vicuna-uncensored:30b', display: 'wizard-vicuna-uncensored:30b' },
  { name: 'nous-hermes2:34b', display: 'nous-hermes2:34b' },
  { name: 'nemotron:70b', display: 'nemotron:70b' },
  { name: 'phi3:medium-128k', display: 'phi3:medium-128k (14b)' },
  { name: 'phi3:14b-medium-128k-instruct-fp16', display: 'phi3:14b-medium-128k-instruct-fp16' },
  { name: 'llama3.3:70b', display: 'llama3.3:70b' },
];

export const spModels = [
  { name: 'phi3:medium-128k', display: 'phi3:medium-128k [Faster, less-precise]' },
  { name: 'phi3:14b-medium-128k-instruct-fp16', display: 'phi3:14b-medium-128k-instruct-fp16 [Default]' },
  { name: 'llama3.3:70b', display: 'llama3.3:70b [Slower, more precise]' },
];
