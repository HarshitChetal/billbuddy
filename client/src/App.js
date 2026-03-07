import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Selection from './pages/Selection';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SetupProfile from './pages/SetupProfile';
import Inventory from './pages/Inventory'; // 🆕 Naya import [cite: 130]

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Selection />} />
        <Route path="/business/:role/auth" element={<AuthPage />} />
        <Route path="/setup-business" element={<SetupProfile />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 🆕 Inventory Route register kiya  */}
        <Route path="/inventory" element={<Inventory />} /> 
      </Routes>
    </Router>
  );
}

export default App;