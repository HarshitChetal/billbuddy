import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// 🌳 Recursive Blueprint Node for Categories
const CategoryNode = ({ category, allCategories, onAddSub, onDelete, onSelect, activeId, onUpdateImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = allCategories.filter(cat => cat.parent === category._id);
  
  return (
    <div style={{ marginLeft: '25px', marginBottom: '10px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{...categoryItemStyle, border: activeId === category._id ? '2px solid #121212' : '1px solid #EEE'}}>
        <div onClick={() => { setIsOpen(!isOpen); onSelect(category); }} style={nodeTrigger}>
          <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>▶</motion.span>
          {category.image ? <img src={category.image} style={thumbnailStyle} alt="cat" /> : <span>{children.length > 0 ? '📁' : '📄'}</span>}
          <span style={{ fontWeight: '700' }}>{category.name}</span>
        </div>
        <div style={catActions}>
          <button style={{...subBtn, border: '1px solid #6c757d', color: '#6c757d'}} onClick={(e) => { e.stopPropagation(); onUpdateImage(category); }}>📸 Icon</button>
          <button style={subBtn} onClick={(e) => { e.stopPropagation(); onAddSub(category); }}>+ Sub</button>
          <button style={delBtn} onClick={(e) => { e.stopPropagation(); onDelete(category._id); }}>Delete</button>
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} style={{ overflow: 'hidden', borderLeft: '1px dashed #DDD', marginLeft: '12px' }}>
            {children.map(child => <CategoryNode key={child._id} category={child} allCategories={allCategories} onAddSub={onAddSub} onDelete={onDelete} onSelect={onSelect} activeId={activeId} onUpdateImage={onUpdateImage} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Inventory() {
  const [activeTab, setActiveTab] = useState('stock'); 
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCat, setSelectedCat] = useState(null);
  
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [isImageUpdateModalOpen, setIsImageUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [imagePreview, setImagePreview] = useState("");
  const [parentForNewSub, setParentForNewSub] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', categoryId: '', trackInventory: false, quantity: 0, image: '', cgstRate: 0, sgstRate: 0 
  });

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [catRes, prodRes] = await Promise.all([
        axios.get('http://localhost:5000/api/inventory/categories', { headers }),
        axios.get('http://localhost:5000/api/inventory/products/', { headers })
      ]);
      setCategories(catRes.data); 
      setProducts(prodRes.data);
    } catch (err) { console.error("Sync Error"); }
  };

  const handleImage = (e, target = 'category') => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        if(target === 'product') setNewProduct({...newProduct, image: reader.result});
        else setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  // 🆕 THE FIX: Save Product with GST Rates as Numbers 
  const handleSaveProduct = async () => {
    if (!newProduct.categoryId) return alert("Category select karo!");
    try {
      const token = localStorage.getItem('token');
      const finalProduct = {
        ...newProduct,
        price: Number(newProduct.price) || 0,
        cgstRate: Number(newProduct.cgstRate) || 0,
        sgstRate: Number(newProduct.sgstRate) || 0,
        quantity: Number(newProduct.quantity) || 0
      };

      await axios.post('http://localhost:5000/api/inventory/products/add', finalProduct, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setIsProdModalOpen(false);
      setNewProduct({ name: '', price: '', categoryId: '', trackInventory: false, quantity: 0, image: '', cgstRate: 0, sgstRate: 0 }); 
      fetchData();
      alert("Asset Added Successfully! 🏎️");
    } catch (err) {
      alert("Registration Error: " + err.message);
    }
  };

  const handleUpdateCategoryImage = async () => {
    if (!imagePreview) return alert("Select image first.");
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:5000/api/inventory/categories/${categoryToUpdate._id}/image`, { image: imagePreview }, { headers: { Authorization: `Bearer ${token}` } });
    setIsImageUpdateModalOpen(false); setImagePreview(''); fetchData();
  };

  const getSubIds = (id) => {
    let ids = [id];
    categories.filter(c => c.parent === id).forEach(child => { ids = [...ids, ...getSubIds(child._id)]; });
    return ids;
  };

  const filteredItems = products.filter(p => {
    const matchesCategory = selectedCat ? getSubIds(selectedCat._id).includes(p.categoryId?._id) : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={inventoryContainer}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>📦 Inventory Engine</h1>
        <div style={tabSwitcher}>
          <button style={activeTab === 'stock' ? activeTabBtn : tabBtn} onClick={() => setActiveTab('stock')}>Live Stock</button>
          <button style={activeTab === 'categories' ? activeTabBtn : tabBtn} onClick={() => setActiveTab('categories')}>Inventory Blueprint</button>
        </div>
      </header>

      {activeTab === 'stock' && (
        <div style={whiteCard}>
          <div style={actionRow}>
            <h3>{selectedCat ? `Layer: ${selectedCat.name}` : 'Asset Overview'}</h3>
            <div style={{display:'flex', gap:'15px'}}>
               <div style={searchContainer}><input style={searchInputStyle} placeholder="Search identity..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
               <button style={primaryBtn} onClick={() => setIsProdModalOpen(true)}>+ New Asset</button>
            </div>
          </div>
          <table style={tableStyle}>
            <thead><tr style={tableHeader}><th>Visual</th><th>Identity & Tax</th><th>Price</th><th>Stock</th></tr></thead>
            <tbody>
              {filteredItems.map(p => (
                <tr key={p._id} style={tableRow}>
                  <td>{p.image ? <img src={p.image} style={thumbnailStyle} alt="p" /> : <div style={noImgBox}>No Img</div>}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>GST: {Number(p.cgstRate || 0) + Number(p.sgstRate || 0)}% (C:{p.cgstRate}% S:{p.sgstRate}%)</div>
                  </td>
                  <td>₹{p.price}</td>
                  <td style={{ color: p.trackInventory ? (p.quantity > 5 ? '#2ECC71' : '#E74C3C') : '#95A5A6', fontWeight: '800' }}>
                    {p.trackInventory ? `${p.quantity} Units` : 'Service Mode'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div style={whiteCard}>
          <div style={actionRow}><h3>Inventory Blueprint</h3><button style={primaryBtn} onClick={() => { setParentForNewSub(null); setIsCatModalOpen(true); }}>+ Root Variable</button></div>
          {categories.filter(c => !c.parent).map(root => (
            <CategoryNode 
                key={root._id} category={root} allCategories={categories} 
                onAddSub={(cat) => { setParentForNewSub(cat); setIsCatModalOpen(true); }} 
                onDelete={(id) => { if(window.confirm("Delete Category & Linked Products?")) axios.delete(`http://localhost:5000/api/inventory/categories/${id}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).then(fetchData) }} 
                onSelect={setSelectedCat} activeId={selectedCat?._id}
                onUpdateImage={(cat) => { setCategoryToUpdate(cat); setIsImageUpdateModalOpen(true); }} 
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {isProdModalOpen && (
          <div style={modalOverlay}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={modalContent}>
              <h3>New Asset Registration</h3>
              <label style={labelStyle}>Blueprint Layer</label>
              <select style={inputStyle} value={newProduct.categoryId} onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}>
                <option value="">Choose a Category...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input style={inputStyle} value={newProduct.name} placeholder="Asset Name" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              <input style={inputStyle} value={newProduct.price} placeholder="Price" type="number" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CGST %</label>
                  <input style={{...inputStyle, marginBottom: 0}} type="number" placeholder="9" value={newProduct.cgstRate} onChange={(e) => setNewProduct({...newProduct, cgstRate: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>SGST %</label>
                  <input style={{...inputStyle, marginBottom: 0}} type="number" placeholder="9" value={newProduct.sgstRate} onChange={(e) => setNewProduct({...newProduct, sgstRate: e.target.value})} />
                </div>
              </div>

              <input type="file" accept="image/*" onChange={(e) => handleImage(e, 'product')} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0' }}>
                <input type="checkbox" checked={newProduct.trackInventory} onChange={(e) => setNewProduct({...newProduct, trackInventory: e.target.checked})} />
                <label style={{fontWeight: '600'}}>Track Stock?</label>
              </div>
              {newProduct.trackInventory && (
                <input style={inputStyle} value={newProduct.quantity} placeholder="Quantity" type="number" onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} />
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={primaryBtn} onClick={handleSaveProduct}>Save Asset</button>
                <button style={cancelBtn} onClick={() => setIsProdModalOpen(false)}>Cancel</button>
              </div>
          </motion.div></div>
        )}

        {isCatModalOpen && (
          <div style={modalOverlay}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={modalContent}>
              <h3>{parentForNewSub ? `Add to ${parentForNewSub.name}` : 'New Root Variable'}</h3>
              <input style={inputStyle} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Identity Name..." />
              <input type="file" accept="image/*" onChange={(e) => handleImage(e)} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button style={primaryBtn} onClick={() => {
                   const token = localStorage.getItem('token');
                   axios.post('http://localhost:5000/api/inventory/categories/add', 
                    { name: newCatName, parent: parentForNewSub?._id || null, image: imagePreview }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                   ).then(() => { setIsCatModalOpen(false); setNewCatName(''); setImagePreview(''); fetchData(); });
                }}>Confirm</button>
                <button style={cancelBtn} onClick={() => setIsCatModalOpen(false)}>Discard</button>
              </div>
          </motion.div></div>
        )}

        {isImageUpdateModalOpen && (
          <div style={modalOverlay}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={modalContent}>
              <h3>Update Visual: {categoryToUpdate?.name}</h3>
              <input type="file" accept="image/*" onChange={(e) => handleImage(e)} style={{ marginBottom: '10px' }} />
              {imagePreview && <img src={imagePreview} style={{ width: '100%', borderRadius: '15px', maxHeight: '150px', objectFit: 'cover' }} alt="prev" />}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button style={primaryBtn} onClick={handleUpdateCategoryImage}>Finalize</button>
                <button style={cancelBtn} onClick={() => { setIsImageUpdateModalOpen(false); setImagePreview(''); }}>Discard</button>
              </div>
          </motion.div></div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🎨 BRAND STYLES [cite: 177-199]
const labelStyle = { fontSize: '11px', color: '#888', marginBottom: '5px', display: 'block', fontWeight: '600' };
const searchContainer = { backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '0 15px', border: '1px solid #EEE' };
const searchInputStyle = { border: 'none', background: 'transparent', padding: '12px 0', outline: 'none', width: '200px', fontSize: '14px' };
const noImgBox = { width: '40px', height: '40px', borderRadius: '10px', background: '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '10px', color: '#999' };
const thumbnailStyle = { width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' };
const nodeTrigger = { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 };
const inventoryContainer = { padding: '60px', backgroundColor: '#FBFBFA', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' };
const titleStyle = { fontSize: '34px', fontWeight: '800' };
const tabSwitcher = { display: 'flex', gap: '8px', backgroundColor: '#F0EFEA', padding: '6px', borderRadius: '20px' };
const tabBtn = { padding: '12px 28px', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', backgroundColor: 'transparent' };
const activeTabBtn = { ...tabBtn, backgroundColor: '#FFFFFF', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' };
const whiteCard = { backgroundColor: '#FFFFFF', padding: '50px', borderRadius: '45px', boxShadow: '0 25px 60px rgba(0,0,0,0.02)' };
const actionRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' };
const categoryItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', borderRadius: '20px' };
const catActions = { display: 'flex', gap: '12px' };
const subBtn = { padding: '8px 16px', borderRadius: '12px', border: '1px solid #121212', cursor: 'pointer', fontWeight: '700', fontSize: '11px' };
const delBtn = { ...subBtn, border: '1px solid #FF4D4D', color: '#FF4D4D' };
const primaryBtn = { padding: '15px 32px', borderRadius: '18px', border: 'none', backgroundColor: '#121212', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' };
const cancelBtn = { ...primaryBtn, backgroundColor: '#F5F5F5', color: '#555' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { textAlign: 'left', borderBottom: '2px solid #F9F9F9', color: '#AAA', fontSize: '12px', paddingBottom: '20px' };
const tableRow = { borderBottom: '1px solid #FAFAFA', height: '80px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' };
const modalContent = { backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '35px', width: '440px' };
const inputStyle = { width: '100%', padding: '18px', borderRadius: '16px', border: '1px solid #EEEEEE', marginBottom: '18px' };

export default Inventory;