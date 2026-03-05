import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Selection from './pages/Selection';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SetupProfile from './pages/SetupProfile'; // 🆕 Naya page import kiya

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Selection />} />
        <Route path="/business/:role/auth" element={<AuthPage />} />
        
        {/* 🆕 Business Profile Setup ka naya route */}
        <Route path="/setup-business" element={<SetupProfile />} /> 
        
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;