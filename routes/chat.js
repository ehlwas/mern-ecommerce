const express = require("express");

const {
    accessChat,
    fetchChats
} = require('../controllers/chatController')

const router = express.Router();

// ROUTES
router.post("/", accessChat)
router.get("/", fetchChats)
  
module.exports = router;