import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryNode = ({ category, allCategories, onAddSub, onDelete, onSelect, activeId, onUpdateImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = allCategories.filter(cat => cat.parent === category._id);

  return (
    <div style={{ marginLeft: '25px', marginBottom: '10px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{...categoryItemStyle, border: activeId === category._id ? '2px solid #121212' : '1px solid #EEE'}}>
        <div onClick={() => { setIsOpen(!isOpen); onSelect(category); }} style={nodeTrigger}>
          <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>▶</motion.span>
          {category.image ? <img src={category.image} style={thumbnailStyle} alt="cat" /> : <span>📁</span>}
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
  const [selectedCat, setSelectedCat] = useState(null); // 🆕 Now used in filter
  const [isCatModalOpen, setIsCatModalOpen] = useState(false); // 🆕 Now used in modal
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [isImageUpdateModalOpen, setIsImageUpdateModalOpen] = useState(false); // 🆕 Now used in modal
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // 🆕 Now used in image logic
  const [newCatName, setNewCatName] = useState('');
  const [parentForNewSub, setParentForNewSub] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '', trackInventory: false, quantity: 0, image: '' });

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [catRes, prodRes] = await Promise.all([
        axios.get('http://localhost:5000/api/inventory/categories', { headers }),
        axios.get('http://localhost:5000/api/inventory/products', { headers })
      ]);
      setCategories(catRes.data); setProducts(prodRes.data);
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

  const handleSaveCategory = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/inventory/categories/add', 
      { name: newCatName, parent: parentForNewSub?._id || null, image: imagePreview }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsCatModalOpen(false); setNewCatName(''); setImagePreview(''); fetchData();
  };

  const handleSaveProduct = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/inventory/products/add', newProduct, { headers: { Authorization: `Bearer ${token}` } });
    setIsProdModalOpen(false); setNewProduct({ name: '', price: '', categoryId: '', trackInventory: false, quantity: 0, image: '' }); fetchData();
  };

  const handleUpdateCategoryImage = async () => {
    if (!imagePreview) return alert("Please select an image first.");
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:5000/api/inventory/categories/${categoryToUpdate._id}/image`, 
        { image: imagePreview }, { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsImageUpdateModalOpen(false); setImagePreview(''); fetchData();
    } catch (err) { alert("Failed to update visual."); }
  };

  const getSubIds = (id) => {
    let ids = [id];
    categories.filter(c => c.parent === id).forEach(child => { ids = [...ids, ...getSubIds(child._id)]; });
    return ids;
  };

  const filteredItems = selectedCat ? products.filter(p => getSubIds(selectedCat._id).includes(p.categoryId?._id)) : products;

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
            <div style={{display:'flex', gap:'10px'}}>
              {selectedCat && <button style={cancelBtn} onClick={() => setSelectedCat(null)}>Clear Filter</button>}
              <button style={primaryBtn} onClick={() => setIsProdModalOpen(true)}>+ New Asset</button>
            </div>
          </div>
          <table style={tableStyle}>
            <thead><tr style={tableHeader}><th>Image</th><th>Identity</th><th>Price</th><th>Stock</th></tr></thead>
            <tbody>
              {filteredItems.map(p => (
                <tr key={p._id} style={tableRow}>
                  <td>{p.image ? <img src={p.image} style={thumbnailStyle} alt="p" /> : '---'}</td>
                  <td style={{ fontWeight: '700' }}>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.trackInventory ? p.quantity : 'Service'}</td>
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
              onDelete={(id) => { if(window.confirm("Are you sure?")) axios.delete(`http://localhost:5000/api/inventory/categories/${id}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}).then(fetchData) }} 
              onSelect={setSelectedCat} activeId={selectedCat?._id} 
              onUpdateImage={(cat) => { setCategoryToUpdate(cat); setIsImageUpdateModalOpen(true); }} 
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {/* 🆕 Warnings Fixed: Image Update Modal used here */}
        {isImageUpdateModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={modalContent}>
              <h3>Update Visual: {categoryToUpdate?.name}</h3>
              <input type="file" accept="image/*" onChange={(e) => handleImage(e)} style={{marginBottom: '10px'}} />
              {imagePreview && <img src={imagePreview} style={{width: '100%', borderRadius: '15px', maxHeight: '150px', objectFit: 'cover'}} alt="prev" />}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}><button style={primaryBtn} onClick={handleUpdateCategoryImage}>Confirm Update</button><button style={cancelBtn} onClick={() => { setIsImageUpdateModalOpen(false); setImagePreview(''); }}>Discard</button></div>
            </motion.div>
          </div>
        )}

        {/* 🆕 Warnings Fixed: Category Modal used here */}
        {isCatModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={modalContent}>
              <h3>{parentForNewSub ? `Adding to ${parentForNewSub.name}` : 'New Root Variable'}</h3>
              <input style={inputStyle} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Name..." />
              <input type="file" accept="image/*" onChange={(e) => handleImage(e)} style={{marginBottom: '10px'}} />
              {imagePreview && <img src={imagePreview} style={{width: '60px', borderRadius: '10px'}} alt="prev" />}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}><button style={primaryBtn} onClick={handleSaveCategory}>Confirm</button><button style={cancelBtn} onClick={() => setIsCatModalOpen(false)}>Discard</button></div>
            </motion.div>
          </div>
        )}

        {isProdModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={modalContent}>
              <h3>Register New Asset</h3>
              <select style={inputStyle} onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input style={inputStyle} placeholder="Name" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              <input style={inputStyle} placeholder="Price" type="number" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
              <input type="file" accept="image/*" onChange={(e) => handleImage(e, 'product')} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}><input type="checkbox" checked={newProduct.trackInventory} onChange={(e) => setNewProduct({...newProduct, trackInventory: e.target.checked})} /><label>Track Stock?</label></div>
              {newProduct.trackInventory && <input style={inputStyle} placeholder="Quantity" type="number" onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} />}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}><button style={primaryBtn} onClick={handleSaveProduct}>Finalize</button><button style={cancelBtn} onClick={() => setIsProdModalOpen(false)}>Discard</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🎨 PREMIUM STYLES
const thumbnailStyle = { width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' };
const nodeTrigger = { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 };
const inventoryContainer = { padding: '60px', backgroundColor: '#FBFBFA', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' };
const titleStyle = { fontSize: '34px', fontWeight: '800', letterSpacing: '-1.5px' };
const tabSwitcher = { display: 'flex', gap: '8px', backgroundColor: '#F0EFEA', padding: '6px', borderRadius: '20px' };
const tabBtn = { padding: '12px 28px', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', backgroundColor: 'transparent' };
const activeTabBtn = { ...tabBtn, backgroundColor: '#FFFFFF', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' };
const whiteCard = { backgroundColor: '#FFFFFF', padding: '50px', borderRadius: '45px', boxShadow: '0 25px 60px rgba(0,0,0,0.02)' };
const actionRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' };
const categoryItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', borderRadius: '20px' };
const catActions = { display: 'flex', gap: '12px' };
const subBtn = { padding: '8px 16px', borderRadius: '12px', border: '1px solid #121212', cursor: 'pointer', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' };
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