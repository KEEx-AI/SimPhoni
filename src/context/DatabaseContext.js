// src/context/DatabaseContext.js
import React, { createContext, useContext } from 'react';
import { firestore } from '../firebase';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const saveData = async (path, data) => {
    // Example Firestore usage
    await firestore.collection(path).add(data);
  };

  const loadData = async (path) => {
    const snapshot = await firestore.collection(path).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const value = { saveData, loadData };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
