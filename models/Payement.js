const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payementSchema = new Schema({
    montant: Number,
    datePayement: Date,
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
});

const payementModel = mongoose.model("Payement", payementSchema);

module.exports = payementModel;