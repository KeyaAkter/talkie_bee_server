const chatModel = require("../models/chatModel");

// create a chat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const existedChat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (existedChat) {
      return res.status(200).json(existedChat);
    }

    const newChat = await chatModel.create({
      members: [firstId, secondId],
    });

    res.status(200).json(newChat);
  } catch (err) {
    res.status(500).json(err);
  }
};

// find all chats
const findAllChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const existedChats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(existedChats);
  } catch (err) {
    res.status(500).json(err);
  }
};

// find  a single chat
const findASingleChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const existedChat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(existedChat);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { createChat, findAllChats, findASingleChat };
