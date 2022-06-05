const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    parent_id: String
})

module.exports = mongoose.model('Category', userSchema);