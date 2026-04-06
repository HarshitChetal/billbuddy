import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Settings() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_data')) || {});
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bio: '',
    shopName: '',
    gstin: ''
  });
  const [loading, setLoading] = useState(true);

  // Profile Fetch Logic
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'Owner' 
        ? 'http://localhost:5000/api/business/profile' 
        : 'http://localhost:5000/api/whitelist/my-profile';
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data) setProfile({ ...profile, ...res.data });
      setLoading(false);
    } catch (err) {
      console.error("Profile load fail ho gayi");
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // Update Logic
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'Owner'
        ? 'http://localhost:5000/api/business/update'
        : 'http://localhost:5000/api/whitelist/update-profile';

      const res = await axios.post(endpoint, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Settings Updated! ✅");
      }
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || "Check Backend"));
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontFamily: 'Outfit'}}>Loading Settings...</div>;

  return (
    <div style={{ padding: '60px', backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: 'Outfit' }}>
      <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '40px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>
              {user.role === 'Owner' ? 'Business Profile' : 'Staff Profile'}
            </h2>
            <p style={{ color: '#888', margin: '5px 0 0 0' }}>Manage your account details and preferences</p>
          </div>
          <button onClick={handleUpdate} style={saveBtn}>Save Changes</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Common Fields */}
          <div style={inputGroup}>
            <label style={labelS}>{user.role === 'Owner' ? 'OWNER NAME' : 'FULL NAME'}</label>
            <input 
              style={inputS} 
              value={profile.fullName || profile.ownerName || ''} 
              onChange={e => setProfile({...profile, fullName: e.target.value, ownerName: e.target.value})} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelS}>CONTACT NUMBER</label>
            <input 
              style={inputS} 
              value={profile.phone || profile.contact || ''} 
              onChange={e => setProfile({...profile, phone: e.target.value, contact: e.target.value})} 
            />
          </div>

          {/* Role Specific Fields */}
          {user.role === 'Owner' ? (
            <>
              <div style={inputGroup}>
                <label style={labelS}>SHOP / BUSINESS NAME</label>
                <input style={inputS} value={profile.shopName} onChange={e => setProfile({...profile, shopName: e.target.value})} />
              </div>
              <div style={inputGroup}>
                <label style={labelS}>GSTIN (OPTIONAL)</label>
                <input style={inputS} value={profile.gstin} onChange={e => setProfile({...profile, gstin: e.target.value})} />
              </div>
            </>
          ) : (
            <>
              <div style={inputGroup}>
                <label style={labelS}>EMERGENCY CONTACT</label>
                <input style={inputS} value={profile.emergencyContact} onChange={e => setProfile({...profile, emergencyContact: e.target.value})} />
              </div>
              <div style={inputGroup}>
                <label style={labelS}>DESIGNATION / BIO</label>
                <input style={inputS} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
              </div>
            </>
          )}

          <div style={{ ...inputGroup, gridColumn: 'span 2' }}>
            <label style={labelS}>ADDRESS</label>
            <textarea 
              style={{ ...inputS, height: '100px', resize: 'none' }} 
              value={profile.address} 
              onChange={e => setProfile({...profile, address: e.target.value})} 
            />
          </div>

        </div>

        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: '800' }}>Account Security</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Password change options are coming soon.</p>
          </div>
          <button style={{ ...saveBtn, backgroundColor: 'transparent', color: '#FF4444', border: '1px solid #FF4444' }} onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout Account</button>
        </div>

      </div>
    </div>
  );
}

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelS = { fontSize: '11px', fontWeight: '900', color: '#BBB', letterSpacing: '1.5px' };
const inputS = { width: '100%', padding: '18px', borderRadius: '18px', border: '1px solid #F0F0F0', backgroundColor: '#FBFBFB', outline: 'none', boxSizing: 'border-box', fontSize: '15px', fontWeight: '500' };
const saveBtn = { padding: '15px 35px', borderRadius: '18px', border: 'none', backgroundColor: '#121212', color: '#fff', fontWeight: '800', cursor: 'pointer', transition: '0.3s' };

export default Settings;