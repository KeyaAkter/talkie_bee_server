const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timeStamps: true,
  }
);

const msgModel = mongoose.model("Message", msgSchema);

module.exports = msgModel;
