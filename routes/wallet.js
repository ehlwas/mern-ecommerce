const express = require("express");
// const multer = require("multer");

const { 
    topUpWallet
} = require('../controllers/walletController')

// const upload = multer();

const router = express.Router();

// ROUTES
router.post("/topup", topUpWallet)
  
module.exports = router;