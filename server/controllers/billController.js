const { Invoice, Product, Customer } = require('../models/schemas');

exports.createBill = async (req, res) => {
  try {
    const { customerId, items, paymentMethod } = req.body;
    let subTotal = 0;


    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.quantityInStock < item.quantity) {
        return res.status(400).json({ msg: `Stock kam hai: ${product ? product.name : 'Unknown'}` });
      }
      item.price = product.price;
      item.total = item.price * item.quantity;
      subTotal += item.total;

      product.quantityInStock -= item.quantity;
      await product.save();
    }


    const customer = await Customer.findById(customerId);
    let discount = 0;
    if (customer.loyaltyTier === 'Gold') discount = subTotal * 0.10; // 10%
    else if (customer.loyaltyTier === 'Silver') discount = subTotal * 0.05; // 5%

    const grandTotal = subTotal - discount;

 
    const newInvoice = new Invoice({
      companyId: req.user.companyId,
      customerId,
      soldBy: req.user.userId,
      items,
      subTotal,
      discountApplied: discount,
      grandTotal,
      paymentMethod
    });

    await newInvoice.save();
    res.status(201).json({ msg: "Bill Generated!", invoice: newInvoice });

  } catch (err) {
    res.status(500).send("Billing Error");
  }
};