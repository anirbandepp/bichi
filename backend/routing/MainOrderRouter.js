const { response } = require("express");
const exp = require("express");
const { route } = require("express/lib/application");
const router = exp.Router();
const { ObjectId } = require('mongodb');
// ***** Create table in database *****
const cart = require("../module/Cart");
const mainOrder = require("../module/MainOrder");
const subOrder = require("../module/SubOrder");

router.post("/order_process", async (req, res) => {

    var bname = req.body.bname;
    var bphone = req.body.bphone;
    var baddress = req.body.baddress;
    var sname = req.body.sname;
    var sphone = req.body.sphone;
    var saddress = req.body.saddress;
    var cid = req.body.customer_Id;

    var obj = {
        bname: bname,
        bphone: bphone,
        baddress: baddress,
        sname: sname,
        sphone: sphone,
        saddress: saddress,
        cid: cid,
        paymentId: null,
        paymentStatus: "Pending"
    };

    var query = await mainOrder.create(obj);
    console.log(query);

    res.json({
        msg: "Order Added waiting for payment",
        orderId: query._id
    });
})

router.post("/payment", async (req, res) => {

    var cid = req.body.cid;
    var orderId = req.body.orderId;
    var paymentId = req.body.payment_id;

    var obj = {
        paymentId: paymentId,
        paymentStatus: "Success"
    };

    // ***mainOrder paymentId and paymentStatus update***
    await mainOrder.findByIdAndUpdate(orderId, obj);

    // ***find form cart with matching customer Id***
    var result = await cart.find({ customer_id: cid });

    for (i = 0; i < result.length; i++) {

        var obj = {
            productId: result[i].product_id,
            customerId: result[i].customer_id,
            qty: result[i].qty,
            price: result[i].product_price,
            orderId: orderId
        }
        var suborder = await subOrder.create(obj);
    }

    res.json({
        suborder
    })
})

router.get('/view_orders', async (req, res) => {

    var result = await mainOrder.aggregate([
        {
            $lookup: {
                from: 'suborders',
                localField: '_id',
                foreignField: 'orderId',
                as: 'suborders',
                "pipeline": [
                    {
                        $lookup: {
                            from: "products",
                            localField: 'productId',
                            foreignField: '_id',
                            as: "products"
                        }
                    }
                ],
            },
        }]);

    res.json(result);
});

router.post('/view_customer_orders', async (req, res) => {
    var cid = req.body.customer_Id;


    var result = await mainOrder.aggregate([
        {
            $match: { cid: cid }
        },
        {

            $lookup: {
                from: 'suborders',
                localField: '_id',
                foreignField: 'orderId',
                as: 'suborders',
                "pipeline": [
                    {
                        $lookup: {
                            from: "products",
                            localField: 'productId',
                            foreignField: '_id',
                            as: "products"
                        }
                    }
                ],
            },
        }]);

    res.json(result);
    console.log(result);
});

module.exports = router;