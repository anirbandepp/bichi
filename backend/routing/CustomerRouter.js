const exp = require("express");
const router = exp.Router();

// ***** Create table in database *****
const customerModule = require("../module/Customer");

// ***** use bcrypt for password hashing *****
const bcrypt = require("bcrypt");

// ***** use jwt *****
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    console.log(req.body);

    const salt = await bcrypt.genSalt(15);
    const pass = await bcrypt.hash(req.body.password, salt);

    var obj = {
        name: req.body.name,
        email: req.body.email,
        password: pass
    }

    await customerModule.create(obj);

    res.json({
        msg: "User Register successfully..."
    })

});

router.post("/login", async (req, res) => {

    var checkEmail = await customerModule.find({
        email: req.body.email
    });

    if (checkEmail.length > 0) {

        bcrypt.compare(req.body.password, checkEmail[0].password, (err, result) => {

            if (result == true) {

                // res.json(checkEmail[0]);
                var obj = {
                    id: checkEmail[0]._id,
                    name: checkEmail[0].name,
                    email: checkEmail[0].email,
                }
                var customerToken = jwt.sign(obj, "customer@#2022$%");
                res.json({
                    jwtToken: customerToken
                })

            } else {
                res.json({
                    msg: "Invalid Login"
                })
            }

        });

    } else {
        res.json({
            msg: "Invalid Login"
        })
    }

});

router.get("/customer_data", customerMiddleware, async (req, res) => {

    jwt.verify(req.token, 'customer@#2022$%', (err, customerdata) => {
        if (err) {
            res.json({
                msg: "Invalid Login"
            })
        } else {
            res.json(customerdata);
        }
    })
});

function customerMiddleware(req, res, next) {

    var ftoken = req.headers.authorization;

    if (typeof ftoken == "undefined") {
        res.json({
            msg: "Invalid Login"
        })
    } else {
        var token = ftoken.split(" ")[1];
        req.token = token;
        next();
    }
};

module.exports = router;