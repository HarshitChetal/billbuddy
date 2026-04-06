import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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

  if (loading) return (
    <motion.div
      style={{ padding: '50px', textAlign: 'center', fontFamily: 'Outfit' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Loading Settings...
    </motion.div>
  );

  const fieldVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <motion.div
      style={{ padding: '60px', backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: 'Outfit' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '40px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >

        <motion.div
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>
              {user.role === 'Owner' ? 'Business Profile' : 'Staff Profile'}
            </h2>
            <p style={{ color: '#888', margin: '5px 0 0 0' }}>Manage your account details and preferences</p>
          </div>
          <motion.button
            onClick={handleUpdate}
            style={saveBtn}
            whileHover={{ backgroundColor: '#333', y: -2, boxShadow: '0 10px 25px rgba(18,18,18,0.2)' }}
            whileTap={{ scale: 0.97 }}
          >
            Save Changes
          </motion.button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

          {/* Common Fields */}
          {[
            {
              label: user.role === 'Owner' ? 'OWNER NAME' : 'FULL NAME',
              value: profile.fullName || profile.ownerName || '',
              onChange: e => setProfile({ ...profile, fullName: e.target.value, ownerName: e.target.value })
            },
            {
              label: 'CONTACT NUMBER',
              value: profile.phone || profile.contact || '',
              onChange: e => setProfile({ ...profile, phone: e.target.value, contact: e.target.value })
            }
          ].map((field, i) => (
            <motion.div key={field.label} style={inputGroup} custom={i} variants={fieldVariants} initial="hidden" animate="visible">
              <label style={labelS}>{field.label}</label>
              <motion.input style={inputS} value={field.value} onChange={field.onChange} whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }} />
            </motion.div>
          ))}

          {/* Role Specific Fields */}
          {user.role === 'Owner' ? (
            <>
              <motion.div style={inputGroup} custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <label style={labelS}>SHOP / BUSINESS NAME</label>
                <motion.input style={inputS} value={profile.shopName} onChange={e => setProfile({ ...profile, shopName: e.target.value })} whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }} />
              </motion.div>
              <motion.div style={inputGroup} custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <label style={labelS}>GSTIN (OPTIONAL)</label>
                <motion.input style={inputS} value={profile.gstin} onChange={e => setProfile({ ...profile, gstin: e.target.value })} whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }} />
              </motion.div>
            </>
          ) : (
            <>
              <motion.div style={inputGroup} custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <label style={labelS}>EMERGENCY CONTACT</label>
                <motion.input style={inputS} value={profile.emergencyContact} onChange={e => setProfile({ ...profile, emergencyContact: e.target.value })} whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }} />
              </motion.div>
              <motion.div style={inputGroup} custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <label style={labelS}>DESIGNATION / BIO</label>
                <motion.input style={inputS} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }} />
              </motion.div>
            </>
          )}

          <motion.div style={{ ...inputGroup, gridColumn: 'span 2' }} custom={4} variants={fieldVariants} initial="hidden" animate="visible">
            <label style={labelS}>ADDRESS</label>
            <motion.textarea
              style={{ ...inputS, height: '100px', resize: 'none' }}
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
              whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
            />
          </motion.div>

        </div>

        <motion.div
          style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div>
            <h4 style={{ margin: 0, fontWeight: '800' }}>Account Security</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Password change options are coming soon.</p>
          </div>
          <motion.button
            style={{ ...saveBtn, backgroundColor: 'transparent', color: '#FF4444', border: '1px solid #FF4444' }}
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            whileHover={{ backgroundColor: '#FFF5F5', y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Logout Account
          </motion.button>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelS = { fontSize: '11px', fontWeight: '900', color: '#BBB', letterSpacing: '1.5px' };
const inputS = { width: '100%', padding: '18px', borderRadius: '18px', border: '1px solid #F0F0F0', backgroundColor: '#FBFBFB', outline: 'none', boxSizing: 'border-box', fontSize: '15px', fontWeight: '500' };
const saveBtn = { padding: '15px 35px', borderRadius: '18px', border: 'none', backgroundColor: '#121212', color: '#fff', fontWeight: '800', cursor: 'pointer' };

export default Settings;