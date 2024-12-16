import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import PersonaSetup from './components/PersonaSetup';
import ISSetup from './components/ISSetup';
import InstructSchemas from './components/InstructSchemas';
import MyArrays from './components/MyArrays';
import Tools from './components/Tools';
import ISThread from './components/ISThread';
import Login from './components/Login';  // assuming these exist
import Signup from './components/Signup'; // assuming these exist

function PrivateRoute({ children }) {
  // If you have auth logic: useAuth to check currentUser
  // For now, assume always authenticated or implement logic.
  return children;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/persona-setup" element={<PrivateRoute><PersonaSetup /></PrivateRoute>} />
            <Route path="/is-setup" element={<PrivateRoute><ISSetup /></PrivateRoute>} />
            <Route path="/instruct-schemas" element={<PrivateRoute><InstructSchemas /></PrivateRoute>} />
            <Route path="/my-arrays" element={<PrivateRoute><MyArrays /></PrivateRoute>} />
            <Route path="/tools" element={<PrivateRoute><Tools /></PrivateRoute>} />
            <Route path="/is-thread" element={<PrivateRoute><ISThread /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
