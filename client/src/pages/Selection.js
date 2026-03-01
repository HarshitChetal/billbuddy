import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Selection() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ textAlign: 'center' }}
      >
        <h1 style={logoStyle}>BillBuddy</h1>
        <p style={taglineStyle}>Refining Business Management.</p>
        
        <div style={mainCardStyle}>
          <h2 style={cardHeadingStyle}>Business Portal</h2>
          <p style={instructionStyle}>Select your access level to continue</p>
          
          <div style={buttonGroupStyle}>
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/business/owner/auth')}
              style={primaryBtnStyle}
            >
              Business Owner
            </motion.button>

            <div style={dividerStyle}>
               <span style={dividerLineStyle}></span>
               <span style={dividerTextStyle}>Staff Access</span>
               <span style={dividerLineStyle}></span>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/business/manager/auth')}
                style={secondaryBtnStyle}
              >
                Manager
              </motion.button>
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/business/employee/auth')}
                style={secondaryBtnStyle}
              >
                Employee
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- PROFESSIONAL STYLES ---
const containerStyle = { backgroundColor: '#F9F7F2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Inter', sans-serif" };
const logoStyle = { fontSize: '48px', fontWeight: '900', color: '#121212', letterSpacing: '-1.5px', marginBottom: '8px' };
const taglineStyle = { color: '#888', marginBottom: '40px', fontSize: '16px', fontWeight: '400' };

const mainCardStyle = { backgroundColor: '#FFFFFF', padding: '50px', borderRadius: '40px', width: '360px', boxShadow: '0 30px 100px rgba(0,0,0,0.04)', textAlign: 'center' };
const cardHeadingStyle = { fontSize: '24px', fontWeight: '800', marginBottom: '10px', color: '#121212' };
const instructionStyle = { color: '#AAA', fontSize: '14px', marginBottom: '35px' };

const buttonGroupStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const primaryBtnStyle = { padding: '18px', borderRadius: '15px', border: 'none', backgroundColor: '#121212', color: '#FFF', fontWeight: '700', cursor: 'pointer', fontSize: '16px' };
const secondaryBtnStyle = { flex: 1, padding: '16px', borderRadius: '15px', border: '1px solid #EEE', backgroundColor: '#FDFDFD', color: '#444', fontWeight: '600', cursor: 'pointer', fontSize: '14px' };

const dividerStyle = { display: 'flex', alignItems: 'center', margin: '15px 0', gap: '10px' };
const dividerLineStyle = { flex: 1, height: '1px', backgroundColor: '#EEE' };
const dividerTextStyle = { fontSize: '12px', color: '#CCC', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' };

export default Selection;