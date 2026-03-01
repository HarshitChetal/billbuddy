const mongoose = require('mongoose');


const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  businessCategory: { type: String, required: true },
  shopOfficialNumber: { type: String, required: true },
  shopOfficialEmail: { type: String, required: true },
  settings: { 
    fraudPrevention: { type: Boolean, default: true },
    loyaltyEnabled: { type: Boolean, default: true }
  }
});


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'manager', 'clerk'], default: 'clerk' },
  subRole: { type: String, default: 'General' }, 
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  leaveBalance: { sick: { type: Number, default: 12 }, casual: { type: Number, default: 10 } }
});


const ProductSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  name: { type: String, required: true },
  category: String,
  attributes: { type: Map, of: mongoose.Schema.Types.Mixed },
  price: { type: Number, required: true },
  quantityInStock: { type: Number, default: 0 },
  unitType: { type: String, default: 'pcs' }
});


const InvoiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subTotal: Number,
  discountApplied: { type: Number, default: 0 },
  grandTotal: Number,
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card', 'Credit'], default: 'Cash' },
  createdAt: { type: Date, default: Date.now }
});


const CustomerSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  name: String,
  phones: [String],
  emails: [String],
  loyaltyTier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' }
});

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  status: { type: String, default: 'Pending' }
});

module.exports = {
  Company: mongoose.model('Company', CompanySchema),
  User: mongoose.model('User', UserSchema),
  Product: mongoose.model('Product', ProductSchema),
  Invoice: mongoose.model('Invoice', InvoiceSchema),
  Customer: mongoose.model('Customer', CustomerSchema),
  Leave: mongoose.model('Leave', LeaveSchema)
};