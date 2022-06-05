const { response } = require("express");
const exp = require("express");
const { route } = require("express/lib/application");
const router = exp.Router();

// ***** Create table in database *****
const cart = require("../module/Cart");

router.post("/cart_process", async (req, res) => {

    var pId = req.body.productID;
    var cId = req.body.customerID;
    var resp = await cart.find({ customer_id: cId, product_id: pId });

    if (resp.length > 0) {

        var fqty = Number(resp[0].qty) + 1;

        var obj = {
            qty: fqty
        };

        await cart.findByIdAndUpdate(resp[0]._id, obj);

        res.json({
            msg: "update product quantity",
        })

    } else {
        var obj = {
            product_id: req.body.productID,
            product_price: req.body.productPrice,
            qty: req.body.qty,
            customer_id: req.body.customerID
        };
        await cart.create(obj);
        res.json({
            msg: "Cart Added",
        })
    }

})

router.post('/cart_view', async (req, res) => {

    var customer = req.body.customer_Id;

    var arr = await cart.find({ customer_id: customer });
    var gt = 0;
    for (let i = 0; i < arr.length; i++) {

        gt = Number(gt) + (Number(arr[i].product_price) * Number(arr[i].qty));
    }

    var result = await cart.aggregate([
        {
            $match: { customer_id: customer }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product_id',
                foreignField: '_id',
                as: 'pr'
            },
        }]);
    res.json({ data: result, gt: gt });
});

router.post('/qty', async (req, res) => {

    id = req.body.id;
    pqty = req.body.qty;

    var resp = await cart.find({ _id: id });

    if (resp.length > 0) {
        var fqty = pqty;

        var obj = {
            qty: fqty
        };

        var finalQty = await cart.findByIdAndUpdate(resp[0]._id, obj);
    }

    res.json([
        fqty,
        finalQty
    ]);
});

module.exports = router;