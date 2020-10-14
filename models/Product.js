const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({

  name: {
    type:String,
    required: true
  },
  price: {
    type:String,
    required: true
  },
  stock: {
    type:Number,
    required: true
  },
  ref: {
    type:String,
    required: true
  },
  propriete: {
    type:String,
    required: true
  },
  image: {
    type: String,
    default:
      "https://image.freepik.com/free-psd/natural-cosmetics-arrangement-with-leaves_23-2148608232.jpg",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  checked: {
    type: Boolean,
    default: false
  },
  count:{
    type: Number,
    default: 1
  },

  date: {
    type: Date,
    default: Date.now
  },

  productMoment: {
    type: Boolean,
    default: false
  },
  sold: {
    type: Number,
    default: -1
  }

});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
