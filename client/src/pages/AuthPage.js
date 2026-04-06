import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

      if (subRoleFormatted === 'Owner') {
        try {
          const statusRes = await axios.get('http://localhost:5000/api/business/status', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (statusRes.data.hasProfile) {
            navigate('/dashboard');
          } else {
            navigate('/setup-business');
          }
        } catch (err) {
          navigate('/setup-business');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Kuch gadbad ho gayi");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          style={{ fontSize: '28px', fontWeight: '800', color: '#121212' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </motion.h2>

        <motion.p
          style={{ color: '#888', marginBottom: '30px', textTransform: 'capitalize' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Continue as {role}
        </motion.p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { type: 'email', placeholder: 'Email Address', key: 'email' },
            { type: 'password', placeholder: 'Password', key: 'password' },
          ].map((field, i) => (
            <motion.input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              style={inputStyle}
              value={formData[field.key]}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              required
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.45 }}
              whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.08)' }}
            />
          ))}

          <AnimatePresence>
            {!isLogin && (
              <motion.input
                type="text"
                placeholder="Mobile Number"
                style={inputStyle}
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                required
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            style={buttonStyle}
            whileHover={{ backgroundColor: '#333', y: -2, boxShadow: '0 10px 25px rgba(18,18,18,0.2)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </motion.button>
        </form>

        <motion.p
          style={{ marginTop: '25px', cursor: 'pointer', color: '#666', fontSize: '14px' }}
          onClick={() => setIsLogin(!isLogin)}
          whileHover={{ color: '#121212' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isLogin ? "New to BillBuddy? Create an account" : "Already have an account? Sign in"}
        </motion.p>
      </motion.div>
    </div>
  );
}

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
  backgroundColor: '#FBFBFB', outline: 'none', fontSize: '15px',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};
const buttonStyle = {
  padding: '18px', borderRadius: '15px', border: 'none',
  backgroundColor: '#121212', color: '#FFF', fontWeight: '700',
  cursor: 'pointer', fontSize: '16px', marginTop: '10px'
};

export default AuthPage;