import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user_data')) || {});
  const [username, setUsername] = useState(userData.username || "");
  const [profilePic, setProfilePic] = useState(userData.profilePic || "");

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/update-profile', 
        { username, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        localStorage.setItem('user_data', JSON.stringify(res.data.user));
        alert("Profile Updated! 🚀");
        window.location.reload(); //
      }
    } catch (err) { alert("Update failed"); }
  };

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div style={{ padding: '60px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Outfit' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Settings</h1>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '30px', marginTop: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h4 style={{ margin: 0 }}>Profile Picture</h4>
            <p style={{ color: '#888', fontSize: '14px' }}>Update your dashboard avatar</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <img src={profilePic || 'https://via.placeholder.com/80'} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />
            <input type="file" onChange={handleImage} style={{ display: 'block', fontSize: '12px' }} />
          </div>
        </div>
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Display Name / Username</h4>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #eee', outline: 'none' }} />
        </div>
        <button onClick={handleUpdate} style={{ width: '100%', padding: '18px', backgroundColor: '#121212', color: '#fff', borderRadius: '15px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;