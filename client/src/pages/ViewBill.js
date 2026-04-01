import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ViewBill() {
  const { invoiceNumber } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bills/public/${invoiceNumber}`)
      .then(res => setBill(res.data))
      .catch(err => console.error(err));
  }, [invoiceNumber]);

  if (!bill) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Invoice...</div>;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px' }}>
      {/* Printable Area */}
      <div id="printable-bill" style={{ backgroundColor: '#fff', maxWidth: '800px', margin: '0 auto', padding: '50px', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h1 style={{margin: 0, fontWeight: '900', color: '#121212'}}>TAX INVOICE</h1>
            <p style={{color: '#888'}}># {bill.invoiceNumber}</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <h3 style={{margin: 0}}>BillBuddy Store</h3>
            <p style={{fontSize: '14px', color: '#666'}}>Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{marginBottom: '30px'}}>
          <p style={{color: '#aaa', fontSize: '12px', margin: 0}}>BILL TO</p>
          <h4 style={{margin: '5px 0'}}>{bill.customerName}</h4>
          <p style={{margin: 0, color: '#666'}}>{bill.customerPhone}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #121212', textAlign: 'left' }}>
              <th style={{padding: '15px 0'}}>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th style={{textAlign: 'right'}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{padding: '15px 0'}}>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td style={{textAlign: 'right'}}>₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginLeft: 'auto', width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tax Amount:</span><span>₹{bill.totalTax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #121212', paddingTop: '10px', fontWeight: '900', fontSize: '20px' }}>
            <span>Grand Total:</span><span>₹{bill.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden during Print) */}
      <div style={{ textAlign: 'center', marginTop: '30px' }} className="no-print">
        <button onClick={() => window.print()} style={{ padding: '15px 30px', backgroundColor: '#121212', color: '#fff', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          📥 Download / Print PDF
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          #printable-bill { box-shadow: none !important; width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}
export default ViewBill;