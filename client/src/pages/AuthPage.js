import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthPage() {
  const { role } = useParams(); 
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    mobileNumber: '', 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const subRoleFormatted = role.charAt(0).toUpperCase() + role.slice(1);

    const payload = {
      ...formData,
      subRole: subRoleFormatted,
      role: 'business' 
    };

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user || { email: formData.email, subRole: subRoleFormatted }));

      // 🆕 SMART REDIRECT LOGIC
      if (subRoleFormatted === 'Owner') {
        try {
          // Check karo business profile status
          const statusRes = await axios.get('http://localhost:5000/api/business/status', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (statusRes.data.hasProfile) {
            navigate('/dashboard'); // Profile hai toh dashboard
          } else {
            navigate('/setup-business'); // Nahi hai toh profile setup
          }
        } catch (err) {
          // Agar status check fail ho (nayi profile), toh setup par bhej do
          navigate('/setup-business'); 
        }
      } else {
        // Manager/Employee ke liye seedha dashboard (Abhi ke liye)
        navigate('/dashboard');
      }

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
              placeholder="Mobile Number" 
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
          {isLogin ? "New to BillBuddy? Create an account" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
}

// --- PREMIUM STYLES ---
const containerStyle = { 
  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
  backgroundColor: '#F9F7F2', fontFamily: "'Outfit', sans-serif" 
};

const cardStyle = { 
  backgroundColor: '#FFF', padding: '60px 50px', borderRadius: '40px', 
  boxShadow: '0 30px 100px rgba(0,0,0,0.05)', textAlign: 'center', width: '420px' 
};

const inputStyle = { 
  padding: '16px', borderRadius: '15px', border: '1px solid #F0F0F0', 
  backgroundColor: '#FBFBFB', outline: 'none', fontSize: '15px'
};

const buttonStyle = { 
  padding: '18px', borderRadius: '15px', border: 'none', 
  backgroundColor: '#121212', color: '#FFF', fontWeight: '700', 
  cursor: 'pointer', fontSize: '16px', marginTop: '10px'
};

export default AuthPage;