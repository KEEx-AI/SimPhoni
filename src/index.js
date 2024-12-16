// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';
import './theme.css'; // Ensure dark theme variables

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <AppProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </AppProvider>
  </AuthProvider>
);
