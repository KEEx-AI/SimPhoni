// src/services/SchemasService.js
export async function fetchLoadSchema(schemaName) {
  // Mock schema data. In real code, fetch from Firestore or a backend.
  const mockPersonaArray = {
    arrayName: schemaName,
    personas: [
      {
        id:'12345_0',
        nickname:'Wizard',
        model:'phi3:14b-medium-128k-instruct-fp16',
        creativity:5,
        definePersona:'You are a mystical wizard.'
      },
      {
        id:'12345_1',
        nickname:'Engineer',
        model:'llama3.2:3b',
        creativity:5,
        definePersona:'You are a skilled software engineer in JS.'
      }
    ]
  };

  const mockInstructLines = [
    {id:0, type:'instruct', instructText:'Build a simple function', persona:'Wizard', tool:'', file:null},
    {id:1, type:'instruct', instructText:'Optimize the solution', persona:'Engineer', tool:'', file:null},
    {
      id:2,
      type:'loop',
      iterations:2,
      mode:'count',
      instructLines:[
        {id:0, type:'instruct', instructText:'Refine details further', persona:'Wizard', tool:'', file:null}
      ]
    }
  ];

  return { personas: mockPersonaArray.personas, arrayName: mockPersonaArray.arrayName, instructLines: mockInstructLines };
}
