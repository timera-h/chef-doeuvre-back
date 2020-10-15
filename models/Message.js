const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: String,
  date: Date,
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;