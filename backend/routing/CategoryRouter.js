const { response } = require("express");
const exp = require("express");
const router = exp.Router();

// ***** Create table in database *****
const categoryModule = require("../module/Category");

router.post("/add", async (req, res) => {
    console.log(req.body);

    var obj = {
        name: req.body.cat,
        parent_id: req.body.parent_id
    };

    await categoryModule.create(obj);

    res.json({
        msg: "Category Inserted..."
    })
});

router.get("/list_category", async (req, res) => {

    var result = await categoryModule.find({ parent_id: "" });
    res.json(result);

});

router.post("/delete", async (req, res) => {

    var id = req.body.id
    var resp = await categoryModule.findByIdAndDelete(id);
    res.json({
        msg: "Record deleted successfully"
    })

});

router.post("/category_by_id", async (req, res) => {

    var id = req.body.id
    var resp = await categoryModule.findById(id);
    res.json(resp);

});

router.post("/update_category", async (req, res) => {

    console.log(req.body);

    var obj = {
        name: req.body.cat
    };

    await categoryModule.findByIdAndUpdate(req.body.id, obj);

    res.json({
        msg: "Record updated successfully"
    });

});

// sub category
router.get("/child_category", async (req, res) => {

    var arr = [];

    var result = await categoryModule.find({ parent_id: { $ne: "" } });
    for (i = 0; i < result.length; i++) {

        console.log(result[i].parent_id);

        var parent = await categoryModule.findById(result[i].parent_id);

        var obj = {
            _id: result[i]._id,
            name: result[i].name,
            parentName: parent.name
        };

        console.log(parent);

        arr.push(obj);
    }

    res.json(arr);
});

router.get("/child_parent_category", async (req, res) => {
    var arr = [];

    var result = await categoryModule.find({ parent_id: "" });
    for (i = 0; i < result.length; i++) {

        var child = await categoryModule.find({ parent_id: result[i]._id })

        var obj = {
            _id: result[i]._id,
            name: result[i].name,
            children: child
        };

        arr.push(obj);
    }

    res.json(arr);
});

router.post("/add_sub_category", async (req, res) => {
    console.log(req.body);

    var obj = {
        name: req.body.name,
        parent_id: req.body.parent_id
    };

    await categoryModule.create(obj);

    res.json({
        msg: "Sub Category Inserted..."
    })
});


router.post("/delete_subcategory", async (req, res) => {

    var id = req.body.id
    var resp = await categoryModule.findByIdAndDelete(id);
    res.json({
        msg: "Record deleted successfully",
        resp
    })

});

module.exports = router;