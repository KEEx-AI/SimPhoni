// src/context/AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppData = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [personas, setPersonas] = useState([]);
  const [arrayName, setArrayName] = useState('');
  const [instructLines, setInstructLines] = useState([]);
  const [selectedSPModel, setSelectedSPModel] = useState('phi3:14b-medium-128k-instruct-fp16'); // default S&P model

  return (
    <AppContext.Provider value={{
      personas, setPersonas,
      arrayName, setArrayName,
      instructLines, setInstructLines,
      selectedSPModel, setSelectedSPModel
    }}>
      {children}
    </AppContext.Provider>
  );
};
