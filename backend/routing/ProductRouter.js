const { response } = require("express");
const exp = require("express");
const { json } = require("express/lib/response");
const router = exp.Router();
const fs = require("fs");

// ***** Create table in database *****
const productModule = require("../module/Product");
const categoryModule = require("../module/Category");

router.post("/add", async (req, res) => {

    console.log(req.body);

    var pimg = req.files.pimg;
    var filename = Math.floor(Math.random() * 100000) + pimg.name;

    pimg.mv("./public/product/" + filename, async (err) => {
        if (err) {
            throw err;
        } else {
            var obj = {
                name: req.body.name,
                subcategory: req.body.subcat,
                price: req.body.price,
                stock: req.body.qty,
                pimg: filename
            };

            await productModule.create(obj);
        }
    });

    res.json({
        msg: "Category Inserted..."
    })
});

router.get("/list_product", async (req, res) => {

    var arr = [];
    var result = await productModule.find();

    for (i = 0; i < result.length; i++) {

        var subcat = await categoryModule.findById(result[i].subcategory);

        var obj = {
            _id: result[i]._id,
            subCategoryName: subcat.name,
            productName: result[i].name,
            price: result[i].price,
            stock: result[i].stock,
            pimg: result[i].pimg,
        }

        arr.push(obj)
    }
    res.json(arr);
});

router.post("/delete", async (req, res) => {

    var id = req.body.id;

    let findImg = await productModule.findById(id);
    fs.unlinkSync("./public/product/" + findImg.pimg);

    await productModule.findByIdAndDelete(id);
    res.json({
        msg: "Product deleted..."
    })
});

router.post("/product_by_id", async (req, res) => {

    var id = req.body.id
    var resp = await productModule.findById(id);
    res.json(resp);

});

router.post("/update_product", async (req, res) => {

    var id = req.body.id;
    let findImg = await productModule.findById(id);
    fs.unlinkSync("./public/product/" + findImg.pimg);

    var pimg = req.files.pimg;
    var filename = Math.floor(Math.random() * 100000) + pimg.name;

    pimg.mv("./public/product/" + filename, async (err) => {
        if (err) {
            throw err;
        } else {
            var obj = {
                name: req.body.name,
                subcategory: req.body.subcat,
                price: req.body.price,
                stock: req.body.qty,
                pimg: filename
            };

            await productModule.findByIdAndUpdate(req.body.id, obj);
        }
    });

    res.json({
        msg: "Record updated successfully"
    });
});

module.exports = router;