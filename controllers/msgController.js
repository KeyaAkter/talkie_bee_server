const msgModel = require("../models/msgModel");

// Create Message
const createMsg = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = await msgModel.create({ chatId, senderId, text });

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get Messages
const getMsgs = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await msgModel.find({ chatId });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createMsg,
  getMsgs,
};
