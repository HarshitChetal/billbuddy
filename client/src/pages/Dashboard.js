import React, { useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user_data'));
  const [staff, setStaff] = useState({ email: '', mobile: '', role: 'Manager' });
  const [loading, setLoading] = useState(false);

  const handleWhitelist = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/whitelist/add', {
        email: staff.email,
        mobileNumber: staff.mobile,
        role: staff.role,
        ownerId: user?.id 
      }, {
        headers: { Authorization: `Bearer ${token}` } // Security ke liye
      });

      alert("✅ Staff Authorized: Ab wo is email se signup kar sakte hain.");
      setStaff({ email: '', mobile: '', role: 'Manager' }); // Form clear
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Server connection failed"));
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{ fontWeight: '900', letterSpacing: '-1.5px', margin: 0 }}>BillBuddy</h2>
        <button onClick={() => { localStorage.clear(); window.location.href='/'; }} style={logoutBtn}>Logout</button>
      </header>

      <main style={mainStyle}>
        <section style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '5px' }}>Welcome, {user?.subRole}</h1>
          <p style={{ color: '#888' }}>{user?.email}</p>
        </section>

        {user?.subRole === 'Owner' && (
          <section style={whiteCard}>
            <h3 style={cardTitle}>Authorize Staff Access</h3>
            <p style={cardSub}>Staff can only signup after you whitelist them here.</p>
            
            <form onSubmit={handleWhitelist} style={formStyle}>
              <input 
                placeholder="Staff Email" 
                style={inputStyle} 
                value={staff.email}
                onChange={(e) => setStaff({...staff, email: e.target.value})}
                required
              />
              <input 
                placeholder="Mobile Number" 
                style={inputStyle} 
                value={staff.mobile}
                onChange={(e) => setStaff({...staff, mobile: e.target.value})}
                required
              />
              <select 
                style={inputStyle} 
                value={staff.role}
                onChange={(e) => setStaff({...staff, role: e.target.value})}
              >
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
              <button type="submit" disabled={loading} style={actionBtn}>
                {loading ? "Authorizing..." : "Grant Access"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

// PREMIUM STYLES
const containerStyle = { backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: 'Inter, sans-serif' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #EEE' };
const mainStyle = { padding: '40px 60px', maxWidth: '1200px', margin: '0 auto' };
const whiteCard = { backgroundColor: '#FFF', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.03)' };
const cardTitle = { fontSize: '22px', fontWeight: '800', marginBottom: '5px' };
const cardSub = { color: '#AAA', fontSize: '14px', marginBottom: '30px' };
const formStyle = { display: 'flex', gap: '15px', flexWrap: 'wrap' };
const inputStyle = { padding: '15px', borderRadius: '12px', border: '1px solid #EEE', flex: 1, minWidth: '200px' };
const actionBtn = { padding: '15px 30px', backgroundColor: '#121212', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' };
const logoutBtn = { padding: '10px 20px', borderRadius: '10px', border: '1px solid #EEE', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600' };

export default Dashboard;