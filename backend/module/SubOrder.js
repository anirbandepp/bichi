const mongoose = require('mongoose');

const suborderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId
    },
    customerId: {
        type: mongoose.Schema.ObjectId
    },
    qty: String,
    price: String,
    orderId: {
        type: mongoose.Schema.ObjectId
    },
})

module.exports = mongoose.model('SubOrder', suborderSchema);
