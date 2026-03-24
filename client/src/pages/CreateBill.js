import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function CreateBill() {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/inventory/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  // 🆕 Item add karne ka logic
  const addItem = (product) => {
    const exists = selectedItems.find(item => item.productId === product._id);
    if (exists) return;

    setSelectedItems([...selectedItems, {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      cgstRate: product.cgstRate || 0,
      sgstRate: product.sgstRate || 0,
      stock: product.quantity,
      trackInventory: product.trackInventory
    }]);
    setSearchTerm('');
  };

  const updateQty = (id, newQty) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.productId === id) {
        // Stock Check
        if (item.trackInventory && newQty > item.stock) {
          alert(`Bhai, sirf ${item.stock} units hi bache hain!`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  // 🆕 Calculations
  const calculateTotals = () => {
    let totalBase = 0;
    let totalTax = 0;

    selectedItems.forEach(item => {
      const base = item.price * item.quantity;
      const tax = base * (item.cgstRate + item.sgstRate) / 100;
      totalBase += base;
      totalTax += tax;
    });

    return { totalBase, totalTax, grandTotal: totalBase + totalTax };
  };

  const { totalBase, totalTax, grandTotal } = calculateTotals();

  const handleFinalize = async () => {
    if (!customer.name || selectedItems.length === 0) return alert("Details bharo bhai!");
    
    try {
      const token = localStorage.getItem('token');
      const billData = {
        customerName: customer.name,
        customerPhone: customer.phone,
        items: selectedItems,
        totalBase, totalTax, grandTotal,
        paymentMode: 'Cash'
      };

      await axios.post('http://localhost:5000/api/bills/create', billData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Bill Generated & Stock Updated! 🏎️");
      window.location.reload(); // Reset for next bill
    } catch (err) {
      alert("Billing Error: " + err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '30px' }}>🧾 Bill Generation</h1>
      
      <div style={gridStyle}>
        {/* Left Side: Bill Entry */}
        <div style={cardStyle}>
          <h3>Customer Details</h3>
          <input style={inputStyle} placeholder="Customer Name" onChange={e => setCustomer({...customer, name: e.target.value})} />
          <input style={inputStyle} placeholder="Phone Number" onChange={e => setCustomer({...customer, phone: e.target.value})} />

          <h3>Search Items</h3>
          <input 
            style={inputStyle} 
            placeholder="Type product name..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          {searchTerm && (
            <div style={dropdownStyle}>
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <div key={p._id} style={itemOption} onClick={() => addItem(p)}>
                  {p.name} - ₹{p.price} (Stock: {p.quantity})
                </div>
              ))}
            </div>
          )}

          <table style={{ width: '100%', marginTop: '20px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #EEE' }}>
                <th>Item</th><th>Qty</th><th>Price</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>
                    <input 
                      type="number" 
                      style={{ width: '50px' }} 
                      value={item.quantity} 
                      onChange={e => updateQty(item.productId, parseInt(e.target.value))} 
                    />
                  </td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Side: Final Calculation */}
        <div style={summaryCard}>
          <h3>Order Summary</h3>
          <div style={summaryRow}><span>Subtotal:</span> <span>₹{totalBase.toFixed(2)}</span></div>
          <div style={summaryRow}><span>Total GST:</span> <span>₹{totalTax.toFixed(2)}</span></div>
          <hr />
          <div style={{ ...summaryRow, fontSize: '20px', fontWeight: 'bold' }}>
            <span>Grand Total:</span> <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          <button style={finalizeBtn} onClick={handleFinalize}>Print & Finalize Bill</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { padding: '50px', backgroundColor: '#FBFBFA', minHeight: '100vh', fontFamily: 'Outfit' };
const gridStyle = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' };
const cardStyle = { backgroundColor: '#FFF', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const summaryCard = { ...cardStyle, backgroundColor: '#121212', color: '#FFF', height: 'fit-content' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #EEE', marginBottom: '15px' };
const dropdownStyle = { border: '1px solid #EEE', borderRadius: '12px', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#FFF', color: '#000' };
const itemOption = { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #F5F5F5' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };
const finalizeBtn = { width: '100%', padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: '#2ECC71', color: '#FFF', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };

export default CreateBill;