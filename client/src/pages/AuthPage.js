import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthPage() {
  const { role } = useParams(); // 'owner', 'manager', or 'employee'
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State: Backend ki validation satisfy karne ke liye fields add ki hain
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    mobileNumber: '', // User.js model ki requirement [cite: 174]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    // Logic: URL params se 'role' uthakar 'subRole' set karna (e.g., 'owner' -> 'Owner') [cite: 178]
    const subRoleFormatted = role.charAt(0).toUpperCase() + role.slice(1);

    const payload = {
      ...formData,
      subRole: subRoleFormatted,
      role: 'business' // Tere User.js model ka enum requirement [cite: 174]
    };

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      // Token aur User data save karna [cite: 35]
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user || { email: formData.email, subRole: subRoleFormatted }));

      alert(`Mubarak ho! ${isLogin ? 'Login' : 'Signup'} Success.`);
      navigate('/dashboard'); // Dashboard par redirect [cite: 36]
    } catch (err) {
      alert(err.response?.data?.message || "Kuch gadbad ho gayi");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{fontSize: '28px', fontWeight: '800', color: '#121212'}}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{color: '#888', marginBottom: '30px', textTransform: 'capitalize'}}>
          Continue as {role}
        </p>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={inputStyle}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />

          {!isLogin && (
            <input 
              type="text" 
              placeholder="Mobile Number (Required)" 
              style={inputStyle}
              value={formData.mobileNumber}
              onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
              required 
            />
          )}

          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p style={{marginTop: '25px', cursor: 'pointer', color: '#666', fontSize: '14px'}} 
           onClick={() => setIsLogin(!isLogin)}>
          {isLogin ?
            "New to BillBuddy? Create an account" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
}

// --- PREMIUM STYLES (Outfit/Jakarta Vibes) ---
const containerStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh', 
  backgroundColor: '#F9F7F2',
  fontFamily: "'Outfit', sans-serif" 
};

const cardStyle = { 
  backgroundColor: '#FFF', 
  padding: '60px 50px', 
  borderRadius: '40px', 
  boxShadow: '0 30px 100px rgba(0,0,0,0.05)', 
  textAlign: 'center', 
  width: '420px' 
};

const inputStyle = { 
  padding: '16px', 
  borderRadius: '15px', 
  border: '1px solid #F0F0F0', 
  backgroundColor: '#FBFBFB', 
  outline: 'none',
  fontSize: '15px'
};

const buttonStyle = { 
  padding: '18px', 
  borderRadius: '15px', 
  border: 'none', 
  backgroundColor: '#121212', 
  color: '#FFF', 
  fontWeight: '700', 
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px'
};

export default AuthPage;