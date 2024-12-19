// src/context/AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [personas, setPersonas] = useState([]);
  const [arrayName, setArrayName] = useState('');
  const [instructLines, setInstructLines] = useState([]);
  const [userSchemas, setUserSchemas] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null); // Store uploaded profile pic

  const addUserSchema = (schemaData) => {
    // schemaData should contain personaArray and instructLines
    const id = Date.now().toString();
    const newSchema = { id, ...schemaData };
    setUserSchemas(prev => [...prev, newSchema]);
  };

  return (
    <AppContext.Provider value={{
      personas, setPersonas,
      arrayName, setArrayName,
      instructLines, setInstructLines,
      userSchemas, addUserSchema,
      profilePicture, setProfilePicture
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => useContext(AppContext);
