const express = require('express');
const router = express.Router();

const { registerOwner, login, applyLeave, addStaff } = require('../controllers/authController');
const { addProduct, getInventory } = require('../controllers/productController');
const { createBill } = require('../controllers/billController'); // Naya
const { protect, authorize } = require('../middleware/auth');


router.post('/register-owner', registerOwner);
router.post('/login', login);
router.post('/add-staff', protect, authorize('owner'), addStaff);


router.post('/add-product', protect, authorize('owner', 'manager'), addProduct);
router.get('/inventory', protect, getInventory);


router.post('/create-bill', protect, createBill);


router.post('/apply-leave', protect, applyLeave);

module.exports = router;