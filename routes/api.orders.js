const router = new require("express").Router();
const OrderModel = require("./../models/Order");

// lire toute les orders
router.get("/", async (req, res, next) => {
    try {
        const orders = await OrderModel.find({});
        res.json(orders)
    } catch (err) {
        next(err)
    };
});

// voir un order par son id
router.get("/:id", async (req, res, next) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        res.json(order);
    } catch (err) {
        next(err);
    };
});

// créer un order
router.post("/", async (req, res, next) => {
    try {
        const newOrder = await OrderModel.create(req.body)
        console.log(req.body)
        res.json(newOrder)
    } catch (err) {
        next(err)
    };
});

//   suprimer une commande
router.delete("/:id", async (req, res, next) => {
    try {
        const deleteOrder = await OrderModel.findByIdAndDelete(req.params.id);
        console.log(req.params)
        res.json(deleteOrder)
    } catch (err) {
        next(err)
    };

});

//   mettre à jour un order
router.patch("/:id", async (req, res, next) => {
    try {
        const updateOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        console.log(req.params)
        res.json(updateOrder)
    } catch (err) {
        next(err);
    };
});

//   filtrer order par user
router.get("/findByUser/:id", async (req, res, next) => {
    try {
        const orders = await OrderModel.find();
        const filteredOrders = orders.filter((order) => order.user === req.params.id)
        res.json(filteredOrders);
    } catch (err) {
        next(err)
    };
});


// filtrer order par product 
router.get("/findByProduct/:id", async (req, res, next) => {
    try {
        const orders = await OrderModel.find();
        const filteredOrders = orders.filter((order) => order.products === req.params.id)
        res.json(filteredOrders);
    } catch (err) {
        next(err)
    };
});



module.exports = router;