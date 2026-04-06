import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function ViewBill() {
  const { invoiceNumber } = useParams();
  const [bill, setBill] = useState(null);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchFullBill = async () => {
      try {
        const billRes = await axios.get(`http://localhost:5000/api/bills/public/${invoiceNumber}`);
        setBill(billRes.data);

        const bizRes = await axios.get(`http://localhost:5000/api/business/profile-public/${billRes.data.owner}`);
        setBusiness(bizRes.data);
      } catch (err) { console.error("Fetch error"); }
    };
    fetchFullBill();
  }, [invoiceNumber]);

  if (!bill || !business) return (
    <motion.div
      style={{ textAlign: 'center', padding: '50px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Generating Invoice...
    </motion.div>
  );

  const rowVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i) => ({
      opacity: 1, x: 0,
      transition: { delay: 0.4 + i * 0.06, duration: 0.35 }
    })
  };

  return (
    <motion.div
      style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Outfit' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        id="printable-bill"
        style={{ backgroundColor: '#fff', maxWidth: '850px', margin: '0 auto', padding: '50px', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >

        <motion.div
          style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #121212', paddingBottom: '30px', marginBottom: '30px' }}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <div>
            <h1 style={{ margin: 0, fontWeight: '900', fontSize: '32px' }}>{business.businessName}</h1>
            <p style={{ margin: '5px 0', color: '#666' }}>{business.businessAddress}</p>
            <p style={{ margin: 0 }}><strong>GSTIN:</strong> {business.gstNumber}</p>
            <p style={{ margin: 0 }}><strong>Contact:</strong> {business.contactNumber}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, color: '#888' }}>TAX INVOICE</h2>
            <p style={{ fontWeight: '700' }}>#{bill.invoiceNumber}</p>
            <p style={{ color: '#888' }}>{new Date(bill.createdAt).toLocaleDateString()}</p>
          </div>
        </motion.div>

        <motion.div
          style={{ marginBottom: '40px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <p style={{ color: '#aaa', fontSize: '12px', margin: 0, fontWeight: '800' }}>BILL TO</p>
          <h3 style={{ margin: '5px 0' }}>{bill.customerName}</h3>
          <p style={{ margin: 0, color: '#666' }}>{bill.customerPhone}</p>
        </motion.div>

        <motion.table
          style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <thead>
            <tr style={{ backgroundColor: '#121212', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Item Description</th>
              <th style={{ padding: '15px' }}>Price</th>
              <th style={{ padding: '15px' }}>Qty</th>
              <th style={{ padding: '15px' }}>GST %</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, i) => (
              <motion.tr
                key={i}
                style={{ borderBottom: '1px solid #eee' }}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
              >
                <td style={{ padding: '15px' }}>{item.name}</td>
                <td style={{ padding: '15px' }}>₹{item.price}</td>
                <td style={{ padding: '15px' }}>{item.quantity}</td>
                <td style={{ padding: '15px' }}>{Number(item.cgstRate || 0) + Number(item.sgstRate || 0)}%</td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700' }}>₹{item.total.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>

        <motion.div
          style={{ marginLeft: 'auto', width: '300px' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>Taxable Value:</span><span>₹{bill.totalBase.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#666', fontSize: '14px' }}>
            <span>CGST total:</span><span>₹{(bill.totalTax / 2).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#666', fontSize: '14px' }}>
            <span>SGST total:</span><span>₹{(bill.totalTax / 2).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #121212', marginTop: '10px', paddingTop: '15px', fontWeight: '900', fontSize: '24px' }}>
            <span>Grand Total:</span><span>₹{bill.grandTotal.toFixed(2)}</span>
          </div>
        </motion.div>

        <motion.div
          style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center', color: '#aaa', fontSize: '12px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <p>This is a computer generated invoice. No signature required.</p>
          <p>Thank you for shopping at {business.businessName}!</p>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ textAlign: 'center', marginTop: '30px' }}
        className="no-print"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <motion.button
          onClick={() => window.print()}
          style={{ padding: '15px 40px', backgroundColor: '#121212', color: '#fff', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          whileHover={{ backgroundColor: '#333', y: -3, boxShadow: '0 15px 30px rgba(0,0,0,0.18)' }}
          whileTap={{ scale: 0.97 }}
        >
          📥 Print / Save as PDF
        </motion.button>
      </motion.div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          #printable-bill { box-shadow: none !important; width: 100% !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </motion.div>
  );
}

export default ViewBill;