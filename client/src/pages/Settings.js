import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Settings() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_data')) || {});
  const [profile, setProfile] = useState({
    fullName: '', phone: '', address: '', emergencyContact: '', bio: '', shopName: '', gstin: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      // subRole check logic [cite: 1336, 1341]
      const isOwner = user.subRole === 'Owner' || user.role === 'owner';
      const endpoint = isOwner 
        ? 'http://localhost:5000/api/business/profile' 
        : 'http://localhost:5000/api/whitelist/my-profile';
      
      const res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      
      if (res.data) {
        setProfile({
          ...profile,
          ...res.data,
          fullName: res.data.fullName || res.data.businessName || '',
          phone: res.data.phone || res.data.contactNumber || '',
          address: res.data.address || res.data.businessAddress || '',
          shopName: res.data.businessName || '',
          gstin: res.data.gstNumber || ''
        });
      }
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const isOwner = user.subRole === 'Owner' || user.role === 'owner';
      
      const endpoint = isOwner
        ? 'http://localhost:5000/api/business/setup'
        : 'http://localhost:5000/api/whitelist/update-profile';

      const payload = isOwner ? {
        businessName: profile.shopName,
        businessAddress: profile.address,
        contactNumber: profile.phone,
        businessType: profile.bio || "Retail",
        gstNumber: profile.gstin
      } : {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        emergencyContact: profile.emergencyContact,
        bio: profile.bio
      };

      const res = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success || res.data.data) alert("Settings Updated! ✅");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || "Check Backend Terminal"));
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;

  return (
    <div style={{ padding: '60px', backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: 'Outfit' }}>
      <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h2>Settings ({user.subRole})</h2>
          <button onClick={handleUpdate} style={saveBtn}>Save Changes</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div><label>NAME</label><input style={inputS} value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} /></div>
          <div><label>PHONE</label><input style={inputS} value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
          {/* Emergency Contact fields for staff */}
          {user.subRole !== 'Owner' && (
            <>
              <div><label>EMERGENCY</label><input style={inputS} value={profile.emergencyContact} onChange={e => setProfile({...profile, emergencyContact: e.target.value})} /></div>
              <div><label>BIO</label><input style={inputS} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
            </>
          )}
          <div style={{gridColumn: 'span 2'}}><label>ADDRESS</label><textarea style={inputS} value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} /></div>
        </div>
      </div>
    </div>
  );
}

const inputS = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #EEE', marginBottom: '10px' };
const saveBtn = { padding: '12px 30px', borderRadius: '12px', backgroundColor: '#121212', color: '#fff', cursor: 'pointer' };

export default Settings;