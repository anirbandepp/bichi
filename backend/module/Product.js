const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    subcategory: String,
    price: String,
    stock: String,
    pimg: String
})

module.exports = mongoose.model('Product', userSchema);