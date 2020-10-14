const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDate: Date,
  email: {
    type: String,
    required: true
  },
  tel: Number,
  address: [{
    streetNumber: Number,
    streetName: String,
    zipCode: Number,
    city: String,
    country: String, 
  }],
  password: {
    min: 4,
    required: true,
    type: String,
  },
  passwordConfirme: {
    min: 4,
    required: true,
    type: String,
  },
  products:[{
    type: Schema.Types.ObjectId,
    ref: "Products"
  }],
  comptePaypal: String,
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user",
  },
 
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
