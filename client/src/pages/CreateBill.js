import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function CreateBill() {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/inventory/products/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) { console.error("Products load nahi hue"); }
    };
    fetchProducts();
  }, []);

  const addItem = (product) => {
    const stockAvailable = product.quantity || 0;
    if (stockAvailable <= 0) return alert("Bhai, ye item stock mein nahi hai!");

    if (selectedItems.find(item => item.productId === product._id)) {
      return alert("Item pehle se added hai, quantity wahi se badhao!");
    }

    const price = Number(product.price);
    const totalTaxRate = Number(product.cgstRate || 0) + Number(product.sgstRate || 0);
    const taxAmount = (price * totalTaxRate) / 100;

    setSelectedItems([...selectedItems, {
      productId: product._id,
      name: product.name,
      price: price,
      quantity: 1,
      availableStock: stockAvailable,
      cgstRate: product.cgstRate,
      sgstRate: product.sgstRate,
      total: price + taxAmount
    }]);
    setSearchTerm('');
  };

  const updateItemQuantity = (productId, newQty) => {
    const qty = Number(newQty);
    if (qty < 1) return;

    const updatedItems = selectedItems.map(item => {
      if (item.productId === productId) {
        if (qty > item.availableStock) {
          alert(`Quantity Exceeded! Bhai sirf ${item.availableStock} hi bache hain.`);
          return item;
        }
        const baseTotal = item.price * qty;
        const taxTotal = baseTotal * (Number(item.cgstRate || 0) + Number(item.sgstRate || 0)) / 100;
        return { ...item, quantity: qty, total: baseTotal + taxTotal };
      }
      return item;
    });
    setSelectedItems(updatedItems);
  };

  const calculateTotals = () => {
    let base = 0, tax = 0;
    selectedItems.forEach(item => {
      const b = item.price * item.quantity;
      base += b;
      tax += b * (Number(item.cgstRate || 0) + Number(item.sgstRate || 0)) / 100;
    });
    return { totalBase: base, totalTax: tax, grandTotal: base + tax };
  };

  const { totalBase, totalTax, grandTotal } = calculateTotals();

  const handleFinalize = async () => {
    if (!customer.name || !customer.phone || selectedItems.length === 0) {
      return alert("Bhai customer details aur items toh dalo!");
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        customerName: customer.name,
        customerPhone: customer.phone,
        items: selectedItems,
        totalBase,
        totalTax,
        grandTotal,
        paymentMode: 'Cash'
      };
      const res = await axios.post('http://localhost:5000/api/bills/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        window.open(`http://localhost:3000/view-bill/${res.data.bill.invoiceNumber}`, '_blank');
        window.location.reload();
      }
    } catch (err) { alert(err.response?.data?.message || "Bill generate nahi ho paya"); }
  };

  return (
    <motion.div
      style={{ padding: '40px', fontFamily: 'Outfit', backgroundColor: '#F9F7F2', minHeight: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        style={{ fontWeight: '900', marginBottom: '30px' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        🧾 Billing Terminal
      </motion.h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>

        <motion.div
          style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.input
            placeholder="Customer Name"
            style={inputS}
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
            whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
          />
          <motion.input
            placeholder="WhatsApp Number"
            style={inputS}
            onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
          />
          <div style={{ position: 'relative' }}>
            <motion.input
              placeholder="Search Products..."
              value={searchTerm}
              style={inputS}
              onChange={e => setSearchTerm(e.target.value)}
              whileFocus={{ borderColor: '#121212', boxShadow: '0 0 0 3px rgba(18,18,18,0.07)' }}
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.div
                  style={dropdownS}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                    <motion.div
                      key={p._id}
                      onClick={() => addItem(p)}
                      style={dropdownItemS}
                      whileHover={{ backgroundColor: '#F9F9F9' }}
                    >
                      <span>{p.name}</span>
                      <span style={{ color: p.quantity < 5 ? '#E74C3C' : '#2ECC71', fontSize: '12px', fontWeight: 'bold' }}>Stock: {p.quantity}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#BBB', borderBottom: '1px solid #EEE', fontSize: '12px', letterSpacing: '1px' }}>
                <th style={{ padding: '10px' }}>ITEM</th>
                <th style={{ padding: '10px' }}>QTY</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {selectedItems.map(item => (
                  <motion.tr
                    key={item.productId}
                    style={{ borderBottom: '1px solid #FAFAFA' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <td style={{ padding: '20px 10px' }}>
                      <div style={{ fontWeight: '700', fontSize: '16px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Available: <span style={{ color: '#121212', fontWeight: 'bold' }}>{item.availableStock}</span></div>
                    </td>
                    <td style={{ padding: '20px 10px' }}>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.productId, e.target.value)}
                        style={qtyInputS}
                      />
                    </td>
                    <td style={{ padding: '20px 10px', textAlign: 'right', fontWeight: '800', fontSize: '16px' }}>₹{item.total.toFixed(2)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        <motion.div
          style={{ backgroundColor: '#121212', color: '#fff', padding: '45px', borderRadius: '40px', height: 'fit-content', position: 'sticky', top: '40px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 style={{ marginTop: 0, fontSize: '24px', fontWeight: '800' }}>Summary</h3>
          <div style={{ margin: '30px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#888' }}>
              <span>Tax (GST)</span><span>₹{totalTax.toFixed(2)}</span>
            </div>
            <motion.div
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '32px', color: '#fff', fontWeight: '900', borderTop: '1px solid #333', paddingTop: '20px', marginTop: '10px' }}
              animate={{ scale: grandTotal > 0 ? [1, 1.03, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
            </motion.div>
          </div>
          <motion.button
            onClick={handleFinalize}
            style={finalizeBtnS}
            whileHover={{ backgroundColor: '#27AE60', y: -3, boxShadow: '0 12px 30px rgba(46,204,113,0.35)' }}
            whileTap={{ scale: 0.97 }}
          >
            Finalize & WhatsApp 🚀
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
}

const inputS = { width: '100%', padding: '18px', marginBottom: '15px', borderRadius: '15px', border: '1px solid #F0F0F0', outline: 'none', backgroundColor: '#FBFBFB', boxSizing: 'border-box', fontSize: '15px' };
const dropdownS = { position: 'absolute', top: '60px', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #EEE', borderRadius: '15px', zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto' };
const dropdownItemS = { padding: '15px', cursor: 'pointer', borderBottom: '1px solid #F9F9F9', display: 'flex', justifyContent: 'space-between', transition: '0.2s background' };
const qtyInputS = { width: '60px', padding: '10px', borderRadius: '10px', border: '1px solid #EEE', fontWeight: 'bold', textAlign: 'center', outline: 'none' };
const finalizeBtnS = { width: '100%', padding: '22px', backgroundColor: '#2ECC71', border: 'none', color: '#fff', borderRadius: '20px', cursor: 'pointer', fontWeight: '900', fontSize: '18px' };

export default CreateBill;