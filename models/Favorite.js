const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favorisSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
});

const favorisModel = mongoose.model("Favoris", favorisSchema);

module.exports = favorisModel;