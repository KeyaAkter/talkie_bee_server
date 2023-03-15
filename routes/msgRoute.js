const express = require("express");
const { createMsg, getMsgs } = require("../controllers/msgController");

// router
const router = express.Router();

router.post("/", createMsg);
router.post("/:chatId", getMsgs);

module.exports = router;
