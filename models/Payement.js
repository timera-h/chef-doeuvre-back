const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payementSchema = new Schema({
    user: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    },
    montant: Number,
    datePayement: Date,
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
});

const payementModel = mongoose.model("Payement", payementSchema);

module.exports = payementModel;