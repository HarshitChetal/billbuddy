import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetupProfile = () => {
  const [formData, setFormData] = useState({
    businessName: '', businessAddress: '', contactNumber: '', businessType: '', gstNumber: ''
  });
  const navigate = useNavigate();

  const fillMockData = () => {
    setFormData({
      businessName: "Harshit Enterprises", //
      businessAddress: "123, Tech Park, Dinanagar, Punjab", //
      contactNumber: "9876543210",
      businessType: "Retail & Electronics", //
      gstNumber: "07AAAAA0000A1Z5"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/business/setup', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard'); //
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>Complete Your Profile</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Tell us about your business to get started.</p>
        
        <button onClick={fillMockData} style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '12px', backgroundColor: '#fff', cursor: 'pointer', marginBottom: '20px', fontWeight: '600' }}>
          ✨ Fill Mock Details
        </button>

        <form onSubmit={handleSubmit}>
          {['businessName', 'businessAddress', 'contactNumber', 'businessType', 'gstNumber'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={formData[field]}
              onChange={(e) => setFormData({...formData, [field]: e.target.value})}
              required={field !== 'gstNumber'}
              style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fdfdfd', boxSizing: 'border-box' }}
            />
          ))}
          <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
            Save and Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;