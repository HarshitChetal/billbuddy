import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 useNavigate add kiya
import axios from 'axios';

function AuthPage() {
  const { role } = useParams();
  const navigate = useNavigate(); // 👈 Navigation hook
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', subRole: role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      // Token aur User data save karna
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));

      alert("Mubarak ho! Login Success.");
      
      // ✅ Sabse important line: Dashboard par bhejo
      navigate('/dashboard'); 

    } catch (err) {
      alert(err.response?.data?.message || "Kuch gadbad ho gayi");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{fontSize: '28px', fontWeight: '800'}}>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>Continue as {role}</p>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={inputStyle}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p style={{marginTop: '20px', cursor: 'pointer', color: '#888'}} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New to BillBuddy? Just signup" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
}

// Minimalist Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F9F7F2' };
const cardStyle = { backgroundColor: '#FFF', padding: '50px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', textAlign: 'center', width: '400px' };
const inputStyle = { padding: '15px', borderRadius: '12px', border: '1px solid #EEE', backgroundColor: '#F0F4FF', outline: 'none' };
const buttonStyle = { padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#121212', color: '#FFF', fontWeight: '700', cursor: 'pointer' };

export default AuthPage;