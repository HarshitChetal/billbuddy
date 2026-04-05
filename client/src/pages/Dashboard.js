import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const [staffData, setStaffData] = useState({ email: '', mobile: '', role: 'Manager' });

  const userData = JSON.parse(localStorage.getItem('user_data')) || {};
  const userName = userData.username || userData.email?.split('@')[0] || "User";
  const displayPic = userData.profilePic;
  const userRole = userData.subRole; 

  const handleGrantAccess = async () => {
    if (!staffData.email || !staffData.mobile) return alert("Bhai, Email aur Mobile dono bharna zaroori hai!");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/whitelist/grant', 
        { email: staffData.email, phone: staffData.mobile, role: staffData.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("Access Granted! 🚀");
        setStaffData({ email: '', mobile: '', role: 'Manager' });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Grant access fail ho gaya");
    }
  };

  return (
    <div style={dashboardContainer}>
      <nav style={navStyle}>
        <h1 style={logoStyle}>BillBuddy</h1>
        <div style={menuWrapper}>
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={profileTrigger}>
            <div style={avatarStyle}>
              {displayPic ? <img src={displayPic} style={imgStyle} alt="profile" /> : userName[0].toUpperCase()}
            </div>
            <span style={userNameStyle}>Hello, {userName} 👋</span>
          </div>

          <div style={{
            ...dropdownStyle,
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
            pointerEvents: isMenuOpen ? 'all' : 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
          }}>
            <div style={dropdownItem} onClick={() => navigate('/create-bill')}>💸 Create Bill</div>
            <div style={dropdownItem} onClick={() => navigate('/inventory')}>📦 Inventory</div>
            <div style={dropdownItem} onClick={() => navigate('/settings')}>⚙️ Settings</div>
            <div style={divider} />
            <div style={{ ...dropdownItem, color: '#ff4444' }} onClick={() => { localStorage.clear(); navigate('/'); }}>🚪 Logout</div>
          </div>
        </div>
      </nav>

      <div style={contentStyle}>
        <div style={welcomeHero}>
          <h2 style={heroTitle}>Welcome, {userRole}</h2>
          <p style={{ color: '#888' }}>{userData.email}</p>
        </div>

        {/* Manager aur Owner dono ko ye cards dikhenge */}
        <div style={actionGrid}>
          <div style={actionCard} onClick={() => navigate('/create-bill')}>
            <div style={iconCircle}>💸</div>
            <div style={cardTextGroup}>
              <h4 style={cardTitle}>Create New Bill</h4>
              <p style={cardSub}>Quick GST Invoice generation</p>
            </div>
          </div>

          <div style={{...actionCard, backgroundColor: '#121212', color: '#fff'}} onClick={() => navigate('/inventory')}>
            <div style={{...iconCircle, backgroundColor: '#333'}}>📦</div>
            <div style={cardTextGroup}>
              <h4 style={{...cardTitle, color: '#fff'}}>Inventory</h4>
              <p style={{color: '#aaa', fontSize: '13px'}}>Full Stock Control</p>
            </div>
          </div>
        </div>

        {userRole === 'Owner' && (
          <div style={{...whiteCard, marginTop: '40px'}}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Authorize Staff Access</h3>
            <p style={{ color: '#888', marginBottom: '30px' }}>Staff can only signup after you whitelist them here.</p>

            <div style={formRow}>
              <input style={inputField} placeholder="Staff Email" value={staffData.email} onChange={(e) => setStaffData({...staffData, email: e.target.value})} />
              <input style={inputField} placeholder="Mobile Number" value={staffData.mobile} onChange={(e) => setStaffData({...staffData, mobile: e.target.value})} />
              <select style={selectField} value={staffData.role} onChange={(e) => setStaffData({...staffData, role: e.target.value})}>
                <option>Manager</option>
                <option>Employee</option>
              </select>
              <button style={grantBtn} onClick={handleGrantAccess}>Grant Access</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const actionGrid = { display: 'flex', gap: '20px', marginBottom: '20px' };
const actionCard = { flex: 1, display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', cursor: 'pointer' };
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