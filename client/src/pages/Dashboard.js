import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // State for Staff Access Form
  const [staffData, setStaffData] = useState({ email: '', mobile: '', role: 'Manager' });

  const userData = JSON.parse(localStorage.getItem('user_data')) || {};
  const userName = userData.username || userData.email?.split('@')[0] || "Owner";
  const displayPic = userData.profilePic;

  return (
    <div style={dashboardContainer}>
      {/* --- PREMIMUM NAV WITH DROPDOWN --- */}
      <nav style={navStyle}>
        <h1 style={logoStyle}>BillBuddy</h1>
        <div style={menuWrapper}>
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={profileTrigger}>
            <div style={avatarStyle}>
              {displayPic ? <img src={displayPic} style={imgStyle} alt="profile" /> : userName[0].toUpperCase()}
            </div>
            <span style={userNameStyle}>Hello, {userName} 👋</span>
          </div>

          {/* 💥 SEXY DROPDOWN MENU */}
          <div style={{
            ...dropdownStyle,
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
            pointerEvents: isMenuOpen ? 'all' : 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
          }}>
            <div style={dropdownItem} onClick={() => navigate('/inventory')}>📦 Inventory</div>
            <div style={dropdownItem} onClick={() => navigate('/settings')}>⚙️ Settings</div>
            <div style={divider} />
            <div style={{ ...dropdownItem, color: '#ff4444' }} onClick={() => { localStorage.clear(); navigate('/'); }}>🚪 Logout</div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div style={contentStyle}>
        <div style={welcomeHero}>
          <h2 style={heroTitle}>Welcome, {userData.subRole || 'Owner'}</h2>
          <p style={{ color: '#888' }}>{userData.email}</p>
        </div>

        {/* --- REAL STAFF ACCESS SECTION (Wahi Purana Wala) --- */}
        <div style={whiteCard}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Authorize Staff Access</h3>
          <p style={{ color: '#888', marginBottom: '30px' }}>Staff can only signup after you whitelist them here.</p>

          <div style={formRow}>
            <input 
              style={inputField} 
              placeholder="Staff Email" 
              value={staffData.email}
              onChange={(e) => setStaffData({...staffData, email: e.target.value})}
            />
            <input 
              style={inputField} 
              placeholder="Mobile Number" 
              value={staffData.mobile}
              onChange={(e) => setStaffData({...staffData, mobile: e.target.value})}
            />
            <select 
              style={selectField}
              value={staffData.role}
              onChange={(e) => setStaffData({...staffData, role: e.target.value})}
            >
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <button style={grantBtn}>Grant Access</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PREMIUM UI STYLES (Matches image_e7787b.png exactly) ---
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