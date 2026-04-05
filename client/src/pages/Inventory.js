import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryNode = ({ category, allCategories, onAddSub, onDelete, onSelect, activeId, onUpdateImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = allCategories.filter(cat => cat.parent === category._id);
  
  return (
    <div style={{ marginLeft: '25px', marginBottom: '10px' }}>
      <div style={{...categoryItemStyle, border: activeId === category._id ? '2px solid #121212' : '1px solid #EEE'}}>
        <div onClick={() => { setIsOpen(!isOpen); onSelect(category); }} style={nodeTrigger}>
          <span>{isOpen ? '▼' : '▶'}</span>
          {category.image ? <img src={category.image} style={thumbnailStyle} alt="cat" /> : <span>📁</span>}
          <span style={{ fontWeight: '700' }}>{category.name}</span>
        </div>
        <div style={catActions}>
          <button style={subBtn} onClick={(e) => { e.stopPropagation(); onAddSub(category); }}>+ Sub</button>
          <button style={delBtn} onClick={(e) => { e.stopPropagation(); onDelete(category._id); }}>Delete</button>
        </div>
      </div>
      {isOpen && (
        <div style={{ borderLeft: '1px dashed #DDD', marginLeft: '12px' }}>
          {children.map(child => <CategoryNode key={child._id} category={child} allCategories={allCategories} onAddSub={onAddSub} onDelete={onDelete} onSelect={onSelect} activeId={activeId} onUpdateImage={onUpdateImage} />)}
        </div>
      )}
    </div>
  );
};

function Inventory() {
  const [activeTab, setActiveTab] = useState('stock'); 
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCat, setSelectedCat] = useState(null);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '', trackInventory: true, quantity: 0, cgstRate: 0, sgstRate: 0 });

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [catRes, prodRes] = await axios.all([
        axios.get('http://localhost:5000/api/inventory/categories', { headers }),
        axios.get('http://localhost:5000/api/inventory/products/', { headers })
      ]);
      setCategories(catRes.data); 
      setProducts(prodRes.data);
    } catch (err) { console.error("Sync Error"); }
  };

  const handleStockUpdate = async (productId, newQuantity) => {
    const val = prompt("Naya Stock Quantity daalo:", newQuantity);
    if (val === null) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/inventory/products/update-stock/${productId}`, 
        { quantity: Number(val) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert("Stock Updated! 📦");
    } catch (err) { alert("Update failed"); }
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/inventory/products/add', newProduct, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setIsProdModalOpen(false);
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const filteredItems = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={inventoryContainer}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>📦 Inventory</h1>
        <div style={tabSwitcher}>
          <button style={activeTab === 'stock' ? activeTabBtn : tabBtn} onClick={() => setActiveTab('stock')}>Live Stock</button>
          <button style={activeTab === 'categories' ? activeTabBtn : tabBtn} onClick={() => setActiveTab('categories')}>Blueprint</button>
        </div>
      </header>

      {activeTab === 'stock' && (
        <div style={whiteCard}>
          <div style={actionRow}>
            <input style={searchInputStyle} placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button style={primaryBtn} onClick={() => setIsProdModalOpen(true)}>+ New Asset</button>
          </div>
          <table style={tableStyle}>
            <thead><tr style={tableHeader}><th>Item</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
            <tbody>
              {filteredItems.map(p => (
                <tr key={p._id} style={tableRow}>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td style={{fontWeight:'800', color: p.quantity < 5 ? 'red' : 'green'}}>{p.quantity} Units</td>
                  <td><button onClick={() => handleStockUpdate(p._id, p.quantity)} style={editBtn}>Edit Stock</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div style={whiteCard}>
           {categories.filter(c => !c.parent).map(root => (
             <CategoryNode key={root._id} category={root} allCategories={categories} onSelect={setSelectedCat} activeId={selectedCat?._id} />
           ))}
        </div>
      )}
    </div>
  );
}

const inventoryContainer = { padding: '40px', fontFamily: 'Outfit' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' };
const titleStyle = { fontSize: '28px', fontWeight: '800' };
const tabSwitcher = { display: 'flex', gap: '10px', backgroundColor: '#eee', padding: '5px', borderRadius: '12px' };
const tabBtn = { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const activeTabBtn = { ...tabBtn, backgroundColor: '#fff', fontWeight: '700' };
const whiteCard = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const actionRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const searchInputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' };
const primaryBtn = { padding: '10px 20px', backgroundColor: '#121212', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { textAlign: 'left', borderBottom: '2px solid #eee', color: '#888' };
const tableRow = { borderBottom: '1px solid #eee', height: '60px' };
const categoryItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '10px', marginBottom: '5px' };
const nodeTrigger = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const thumbnailStyle = { width: '30px', height: '30px', borderRadius: '5px' };
const catActions = { display: 'flex', gap: '10px' };
const subBtn = { padding: '5px 10px', fontSize: '12px', cursor: 'pointer' };
const delBtn = { ...subBtn, color: 'red' };
const editBtn = { padding: '5px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' };

export default Inventory;