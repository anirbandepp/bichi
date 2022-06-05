const mongoose = require('mongoose');

const mainorderSchema = new mongoose.Schema({
    bname: String,
    bphone: String,
    baddress: String,
    sname: String,
    sphone: String,
    saddress: String,
    cid: String,
    paymentId: String,
    paymentStatus: String,
})

module.exports = mongoose.model('MainOrder', mainorderSchema);
