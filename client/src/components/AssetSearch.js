import React from 'react';

const AssetSearch = ({ searchTerm, setSearchTerm, placeholder = "Search assets by identity..." }) => {
  return (
    <div style={searchWrapper}>
      <span style={searchIcon}>🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInput}
      />
      {searchTerm && (
        <button onClick={() => setSearchTerm('')} style={clearBtn}>✕</button>
      )}
    </div>
  );
};

// 🎨 SOPHISTICATED SEARCH STYLES [cite: 23, 144]
const searchWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FBFBFB',
  borderRadius: '16px',
  border: '1px solid #EEEEEE',
  padding: '0 15px',
  width: '100%',
  maxWidth: '400px',
  marginBottom: '20px',
  transition: 'all 0.3s ease'
};

const searchIcon = {
  fontSize: '18px',
  marginRight: '10px',
  color: '#AAA'
};

const searchInput = {
  width: '100%',
  padding: '14px 0',
  border: 'none',
  backgroundColor: 'transparent',
  outline: 'none',
  fontSize: '15px',
  fontFamily: "'Outfit', sans-serif",
  color: '#121212'
};

const clearBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#AAA',
  fontSize: '14px',
  padding: '5px'
};

export default AssetSearch;