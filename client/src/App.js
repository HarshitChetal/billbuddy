import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Selection from './pages/Selection';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SetupProfile from './pages/SetupProfile';
import Inventory from './pages/Inventory'; 
import CreateBill from './pages/CreateBill';
import ViewBill from './pages/ViewBill'; // 🆕 Import kiya

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Selection />} />
        <Route path="/business/:role/auth" element={<AuthPage />} />
        <Route path="/setup-business" element={<SetupProfile />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} /> 
        <Route path="/create-bill" element={<CreateBill />} /> 
        {/* 🆕 Customer View Route */}
        <Route path="/view-bill/:invoiceNumber" element={<ViewBill />} /> 
      </Routes>
    </Router>
  );
}
export default App;