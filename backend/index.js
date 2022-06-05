const exp = require("express");
const app = exp();

// ************* Connect mongoDB ***************
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://anirban:a1234@cluster0.vazyp.mongodb.net/ecom?retryWrites=true&w=majority');

const cors = require("cors");
const bodyParse = require("body-parser");
const expressFileupload = require("express-fileupload");

app.use(cors());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(expressFileupload());
app.use(exp.static('public'));

// ************* Test Route ***************
app.get('/', (req, res) => {
    res.send("hello");
});

// ************* Import Category Routers **************
const category = require("./routing/CategoryRouter");
app.use('/admin/category', category);

// ************* Import Product Routers **************
const product = require("./routing/ProductRouter");
app.use('/admin/product', product);

// ************* Import Frontend Product Search Routers **************
const productSearch = require("./routing/FrontendQuery");
app.use('/product', productSearch);

// ************* Import Frontend Customer Registration Routers **************
const register = require("./routing/CustomerRouter");
app.use('/customer', register);

// ************* Frontend Customer Cart Routers **************
const cart = require("./routing/CartRouter");
app.use('/cart', cart);

// ************* Frontend Main Order Routers **************
const order = require("./routing/MainOrderRouter");
app.use('/order', order);




app.listen(2000);