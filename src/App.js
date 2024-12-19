// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';
import './theme.css';
import Dashboard from './components/Dashboard';
import PersonaSetup from './components/PersonaSetup';
import ISSetup from './components/ISSetup';
import ISSchemas from './components/ISSchemas';
import MyArrays from './components/MyArrays';
import Tools from './components/Tools';
import ISThread from './components/ISThread';
import Login from './components/Login';
import Signup from './components/Signup';

function PrivateRoute({ children }) {
  // Assuming user is considered authenticated for now:
  return children;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <DndProvider backend={HTML5Backend}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/persona-setup" element={<PrivateRoute><PersonaSetup /></PrivateRoute>} />
              <Route path="/is-setup" element={<PrivateRoute><ISSetup /></PrivateRoute>} />
              <Route path="/is-schemas" element={<PrivateRoute><ISSchemas /></PrivateRoute>} />
              <Route path="/my-arrays" element={<PrivateRoute><MyArrays /></PrivateRoute>} />
              <Route path="/tools" element={<PrivateRoute><Tools /></PrivateRoute>} />
              <Route path="/is-thread" element={<PrivateRoute><ISThread /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </DndProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
