const exp = require("express");
const router = exp.Router();

// ***** Create table in database *****
const productModule = require("../module/Product");

// Frontend Product Search
router.post("/search", (req, res) => {

    var search = req.body.search;

    res.json(search);

});

module.exports = router;