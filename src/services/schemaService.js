// src/services/schemaService.js
import { v4 as uuidv4 } from 'uuid';

export function saveISSchemaToUserSchemas(currentISSchema, userSchemas, setUserSchemas) {
  let updated;
  if (!currentISSchema.id) {
    updated = { ...currentISSchema, id: uuidv4() };
    setUserSchemas([...userSchemas, updated]);
  } else {
    const idx = userSchemas.findIndex(s => s.id === currentISSchema.id);
    if (idx > -1) {
      const copy = [...userSchemas];
      copy[idx] = { ...currentISSchema };
      setUserSchemas(copy);
    } else {
      setUserSchemas([...userSchemas, { ...currentISSchema }]);
    }
    updated = currentISSchema;
  }
  return updated;
}

export function loadISSchemaFromFile(file, setCurrentISSchema) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.personaArray && data.instructLines) {
        setCurrentISSchema({
          arrayName: data.personaArray.arrayName,
          personas: data.personaArray.personas.map((p,i)=>({
            id:`${Date.now()}_${i}`,
            nickname:p.nickname,
            model:p.model,
            creativity:p.creativity,
            definePersona:p.definePersona
          })),
          instructLines: data.instructLines
        });
      } else {
        alert('Invalid IS Schema file.');
      }
    } catch (err) {
      alert('Failed to load IS Schema.');
    }
  };
  reader.readAsText(file);
}
