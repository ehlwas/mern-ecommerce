const express = require("express");

const {
    allMessages,
    sendMessage
} = require('../controllers/messageController')

const router = express.Router();

// ROUTES
router.get("/:chatId", allMessages);
router.post("/", sendMessage);
  
module.exports = router;