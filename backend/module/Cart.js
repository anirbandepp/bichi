const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.ObjectId
    },
    product_price: String,
    qty: String,
    customer_id: String
})

module.exports = mongoose.model('Cart', customerSchema);