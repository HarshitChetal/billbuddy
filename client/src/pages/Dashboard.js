import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🆕 Staff state for API
  const [staffData, setStaffData] = useState({ email: '', mobile: '', role: 'Manager' });

  const userData = JSON.parse(localStorage.getItem('user_data')) || {};
  const userName = userData.username || userData.email?.split('@')[0] || "Owner";
  const displayPic = userData.profilePic;

  // 🆕 FIXED GRANT ACCESS FUNCTION
  const handleGrantAccess = async () => {
    if (!staffData.email || !staffData.mobile) return alert("Bhai, Email aur Mobile dono bharna zaroori hai!");

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/whitelist/grant',
        {
          email: staffData.email,
          phone: staffData.mobile, // Backend expects 'phone'
          role: staffData.role
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Access Granted! Staff ab signup kar sakta hai. 🚀");
        setStaffData({ email: '', mobile: '', role: 'Manager' });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Grant access fail ho gaya");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div style={dashboardContainer}>
      {/* --- NAV WITH DROPDOWN --- */}
      <motion.nav
        style={navStyle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          style={logoStyle}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          BillBuddy
        </motion.h1>
        <div style={menuWrapper}>
          <motion.div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={profileTrigger}
            whileHover={{ backgroundColor: '#F0F0F0' }}
            whileTap={{ scale: 0.97 }}
          >
            <div style={avatarStyle}>
              {displayPic ? <img src={displayPic} style={imgStyle} alt="profile" /> : userName[0].toUpperCase()}
            </div>
            <span style={userNameStyle}>Hello, {userName} 👋</span>
          </motion.div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                style={dropdownStyle}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  { icon: '💸', label: 'Create Bill', path: '/create-bill' },
                  { icon: '📦', label: 'Inventory', path: '/inventory' },
                  { icon: '⚙️', label: 'Settings', path: '/settings' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    style={dropdownItem}
                    onClick={() => navigate(item.path)}
                    whileHover={{ backgroundColor: '#F5F5F5', x: 3 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {item.icon} {item.label}
                  </motion.div>
                ))}
                <div style={divider} />
                <motion.div
                  style={{ ...dropdownItem, color: '#ff4444' }}
                  onClick={() => { localStorage.clear(); navigate('/'); }}
                  whileHover={{ backgroundColor: '#FFF5F5', x: 3 }}
                >
                  🚪 Logout
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* --- MAIN CONTENT --- */}
      <motion.div
        style={contentStyle}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div style={welcomeHero} variants={itemVariants}>
          <h2 style={heroTitle}>Welcome, {userData.subRole || 'Owner'}</h2>
          <p style={{ color: '#888' }}>{userData.email}</p>
        </motion.div>

        {/* QUICK ACTIONS SECTION */}
        <motion.div style={actionGrid} variants={itemVariants}>
          <motion.div
            style={actionCard}
            onClick={() => navigate('/create-bill')}
            whileHover={{ y: -5, boxShadow: '0 20px 50px rgba(0,0,0,0.07)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div style={iconCircle}>💸</div>
            <div style={cardTextGroup}>
              <h4 style={cardTitle}>Create New Bill</h4>
              <p style={cardSub}>Quick GST Invoice generation</p>
            </div>
          </motion.div>

          <motion.div
            style={{ ...actionCard, backgroundColor: '#121212', color: '#fff' }}
            onClick={() => navigate('/inventory')}
            whileHover={{ y: -5, boxShadow: '0 20px 50px rgba(18,18,18,0.25)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div style={{ ...iconCircle, backgroundColor: '#333' }}>📦</div>
            <div style={cardTextGroup}>
              <h4 style={{ ...cardTitle, color: '#fff' }}>Inventory</h4>
              <p style={{ color: '#aaa', fontSize: '13px' }}>Stock & Blueprints</p>
            </div>
          </motion.div>
        </motion.div>

        {/* --- STAFF ACCESS SECTION --- */}
        <motion.div style={{ ...whiteCard, marginTop: '40px' }} variants={itemVariants}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Authorize Staff Access</h3>
          <p style={{ color: '#888', marginBottom: '30px' }}>Staff can only signup after you whitelist them here.</p>

          <div style={formRow}>
            <motion.input
              style={inputField}
              placeholder="Staff Email"
              value={staffData.email}
              onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
              whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
            />
            <motion.input
              style={inputField}
              placeholder="Mobile Number"
              value={staffData.mobile}
              onChange={(e) => setStaffData({ ...staffData, mobile: e.target.value })}
              whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
            />
            <select
              style={selectField}
              value={staffData.role}
              onChange={(e) => setStaffData({ ...staffData, role: e.target.value })}
            >
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <motion.button
              style={grantBtn}
              onClick={handleGrantAccess}
              whileHover={{ backgroundColor: '#333', y: -2, boxShadow: '0 8px 20px rgba(18,18,18,0.2)' }}
              whileTap={{ scale: 0.97 }}
            >
              Grant Access
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const actionGrid = { display: 'flex', gap: '20px', marginBottom: '20px' };
const actionCard = { flex: 1, display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', cursor: 'pointer', transition: '0.3s' };
const iconCircle = { width: '60px', height: '60px', backgroundColor: '#F9F7F2', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' };
const cardTextGroup = { display: 'flex', flexDirection: 'column' };
const cardTitle = { fontSize: '20px', fontWeight: '800', margin: 0 };
const cardSub = { fontSize: '13px', color: '#888', margin: 0 };
const dashboardContainer = { minHeight: '100vh', backgroundColor: '#F9F7F2', fontFamily: "'Outfit', sans-serif" };
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 60px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' };
const logoStyle = { fontSize: '24px', fontWeight: '900' };
const menuWrapper = { position: 'relative' };
const profileTrigger = { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 18px', borderRadius: '50px', backgroundColor: '#f8f8f8', cursor: 'pointer' };
const avatarStyle = { width: '32px', height: '32px', backgroundColor: '#121212', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const userNameStyle = { fontWeight: '700', fontSize: '14px' };
const dropdownStyle = { position: 'absolute', top: '60px', right: 0, width: '220px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px', zIndex: 200 };
const dropdownItem = { padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const divider = { height: '1px', backgroundColor: '#eee', margin: '8px 0' };
const contentStyle = { padding: '60px' };
const welcomeHero = { marginBottom: '40px' };
const heroTitle = { fontSize: '48px', fontWeight: '800' };
const whiteCard = { backgroundColor: '#fff', padding: '50px', borderRadius: '40px', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' };
const formRow = { display: 'flex', gap: '15px', alignItems: 'center' };
const inputField = { flex: 2, padding: '18px', borderRadius: '15px', border: '1px solid #F0F0F0', backgroundColor: '#FBFBFB', outline: 'none' };
const selectField = { flex: 1, padding: '18px', borderRadius: '15px', border: '1px solid #F0F0F0', backgroundColor: '#FBFBFB', outline: 'none' };
const grantBtn = { flex: 1, padding: '18px', borderRadius: '15px', border: 'none', backgroundColor: '#121212', color: '#fff', fontWeight: '700', cursor: 'pointer' };

export default Dashboard;