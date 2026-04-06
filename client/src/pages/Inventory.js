import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryNode = ({ category, allCategories, onAddSub, onDelete, onSelect, activeId, onUpdateImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = allCategories.filter(cat => cat.parent === category._id);

  return (
    <motion.div
      style={{ marginLeft: '25px', marginBottom: '10px' }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{ ...categoryItemStyle, border: activeId === category._id ? '2px solid #121212' : '1px solid #EEE' }}
        whileHover={{ backgroundColor: '#FAFAFA' }}
      >
        <div onClick={() => { setIsOpen(!isOpen); onSelect(category); }} style={nodeTrigger}>
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▶
          </motion.span>
          {category.image ? <img src={category.image} style={thumbnailStyle} alt="cat" /> : <span>📁</span>}
          <span style={{ fontWeight: '700' }}>{category.name}</span>
        </div>
        <div style={catActions}>
          <motion.button style={subBtn} onClick={(e) => { e.stopPropagation(); onAddSub(category); }} whileHover={{ backgroundColor: '#EEE' }} whileTap={{ scale: 0.95 }}>+ Sub</motion.button>
          <motion.button style={delBtn} onClick={(e) => { e.stopPropagation(); onDelete(category._id); }} whileHover={{ backgroundColor: '#FFF0F0' }} whileTap={{ scale: 0.95 }}>Delete</motion.button>
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ borderLeft: '1px dashed #DDD', marginLeft: '12px' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children.map(child => (
              <CategoryNode key={child._id} category={child} allCategories={allCategories} onAddSub={onAddSub} onDelete={onDelete} onSelect={onSelect} activeId={activeId} onUpdateImage={onUpdateImage} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
    <motion.div
      style={inventoryContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header
        style={headerStyle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 style={titleStyle}>📦 Inventory</h1>
        <div style={tabSwitcher}>
          {['stock', 'categories'].map(tab => (
            <motion.button
              key={tab}
              style={activeTab === tab ? activeTabBtn : tabBtn}
              onClick={() => setActiveTab(tab)}
              whileHover={{ backgroundColor: activeTab === tab ? '#fff' : '#E5E5E5' }}
              whileTap={{ scale: 0.97 }}
            >
              {tab === 'stock' ? 'Live Stock' : 'Blueprint'}
            </motion.button>
          ))}
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {activeTab === 'stock' && (
          <motion.div
            key="stock"
            style={whiteCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={actionRow}>
              <motion.input
                style={searchInputStyle}
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
              />
              <motion.button
                style={primaryBtn}
                onClick={() => setIsProdModalOpen(true)}
                whileHover={{ backgroundColor: '#333', y: -2, boxShadow: '0 8px 20px rgba(18,18,18,0.2)' }}
                whileTap={{ scale: 0.97 }}
              >
                + New Asset
              </motion.button>
            </div>
            <table style={tableStyle}>
              <thead><tr style={tableHeader}><th>Item</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
              <tbody>
                <AnimatePresence>
                  {filteredItems.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      style={tableRow}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td style={{ fontWeight: '800', color: p.quantity < 5 ? 'red' : 'green' }}>{p.quantity} Units</td>
                      <td>
                        <motion.button
                          onClick={() => handleStockUpdate(p._id, p.quantity)}
                          style={editBtn}
                          whileHover={{ backgroundColor: '#E8E8E8', y: -1 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          Edit Stock
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            style={whiteCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {categories.filter(c => !c.parent).map(root => (
              <CategoryNode key={root._id} category={root} allCategories={categories} onSelect={setSelectedCat} activeId={selectedCat?._id} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const inventoryContainer = { padding: '40px', fontFamily: 'Outfit' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' };
const titleStyle = { fontSize: '28px', fontWeight: '800' };
const tabSwitcher = { display: 'flex', gap: '10px', backgroundColor: '#eee', padding: '5px', borderRadius: '12px' };
const tabBtn = { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' };
const activeTabBtn = { ...tabBtn, backgroundColor: '#fff', fontWeight: '700' };
const whiteCard = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const actionRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const searchInputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '250px', outline: 'none' };
const primaryBtn = { padding: '10px 20px', backgroundColor: '#121212', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { textAlign: 'left', borderBottom: '2px solid #eee', color: '#888' };
const tableRow = { borderBottom: '1px solid #eee', height: '60px' };
const categoryItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '10px', marginBottom: '5px' };
const nodeTrigger = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const thumbnailStyle = { width: '30px', height: '30px', borderRadius: '5px' };
const catActions = { display: 'flex', gap: '10px' };
const subBtn = { padding: '5px 10px', fontSize: '12px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' };
const delBtn = { ...subBtn, color: 'red' };
const editBtn = { padding: '5px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' };

export default Inventory;