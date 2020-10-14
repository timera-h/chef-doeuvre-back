const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    numOrder: Number,
    products: [{
        type: Schema.Types.ObjectId,
        quantity: Number,
        ref: "product",
    }],
    statusPayement: {
        enum: ["En cours", "Payée", "Refusée"]
    },
    orderDate: Date,

});

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;