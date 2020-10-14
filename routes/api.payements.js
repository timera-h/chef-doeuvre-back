const router = new require("express").Router();
const PayementModel = require("../models/Payement");

// voir tout les payements
router.get("/", async (req, res, next) => {
    try {
        const payement = await PayementModel.find()
        res.json(payement);
    } catch (err) {
        next(err);
    };
});

// voir le payement par id
router.get("/:id", async (req, res, next) => {
    try {
        const payement = await PayementModel.findById(req.params.id);
        res.json(payement);
    } catch (err) {
        next(err);
    };
});

// create payement
router.post("/", async (req, res, next) => {
    try {
        const newPayement = await PayementModel.create(req.body)
        console.log(req.body)
        res.json(newPayement)
    } catch (err) {
        next(err)
    };
});

// supprimer un payement par id
router.delete("/:id", async (req, res, next) => {
    try {
        const deletePayement = await PayementModel.findByIdAndDelete(req.params.id);
        res.json(deletePayement)
    } catch (err) {
        next(err)
    };

});

// mettre à jour un payement
router.patch("/:id", async (req, res, next) => {
    try {
        const updatePayement = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        console.log(req.params)
        res.json(updatePayement)
    } catch (err) {
        next(err);
    };
});



module.exports = router;