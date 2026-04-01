import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, []);

  const addItem = (product) => {
    if (selectedItems.find(item => item.productId === product._id)) return;
    const price = Number(product.price);
    const tax = price * (Number(product.cgstRate || 0) + Number(product.sgstRate || 0)) / 100;
    
    setSelectedItems([...selectedItems, {
      productId: product._id, name: product.name, price,
      quantity: 1, cgstRate: product.cgstRate, sgstRate: product.sgstRate,
      total: price + tax
    }]);
    setSearchTerm('');
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
    if (!customer.name || !customer.phone || selectedItems.length === 0) return alert("Details bharo!");
    try {
      const token = localStorage.getItem('token');
      const payload = {
        customerName: customer.name, customerPhone: customer.phone,
        items: selectedItems, totalBase, totalTax, grandTotal, paymentMode: 'Cash'
      };
      const res = await axios.post('http://localhost:5000/api/bills/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const inv = res.data.bill.invoiceNumber;
        const phone = customer.phone.startsWith('91') ? customer.phone : `91${customer.phone}`;
        const link = `http://localhost:3000/view-bill/${inv}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Aapka Bill: ' + link)}`, '_blank');
        window.location.reload();
      }
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Outfit', backgroundColor: '#F9F7F2', minHeight: '100vh' }}>
      <h1 style={{fontWeight: '800'}}>🧾 Billing Terminal</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '25px' }}>
          <input placeholder="Customer Name" style={inputS} onChange={e => setCustomer({...customer, name: e.target.value})} />
          <input placeholder="WhatsApp Number" style={inputS} onChange={e => setCustomer({...customer, phone: e.target.value})} />
          <input placeholder="Search Products..." value={searchTerm} style={inputS} onChange={e => setSearchTerm(e.target.value)} />
          {searchTerm && <div style={{border: '1px solid #eee'}}>{products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p._id} onClick={() => addItem(p)} style={{padding: '10px', cursor: 'pointer'}}>{p.name} - ₹{p.price}</div>
          ))}</div>}
          <table style={{width: '100%', marginTop: '20px'}}>
            <thead><tr style={{textAlign: 'left', color: '#aaa'}}><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>{selectedItems.map(item => (
              <tr key={item.productId}><td>{item.name}</td><td>{item.quantity}</td><td>₹{item.total.toFixed(2)}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ backgroundColor: '#121212', color: '#fff', padding: '30px', borderRadius: '25px', height: 'fit-content' }}>
          <h3>Summary</h3>
          <p>Tax: ₹{totalTax.toFixed(2)}</p>
          <h2>Total: ₹{grandTotal.toFixed(2)}</h2>
          <button onClick={handleFinalize} style={{width: '100%', padding: '15px', backgroundColor: '#2ECC71', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'}}>Finalize & WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
const inputS = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee' };
export default CreateBill;