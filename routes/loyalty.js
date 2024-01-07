const express = require("express");

const {
    getLoyaltyInfo,
} = require('../controllers/loyaltyController')

const router = express.Router();

// ROUTES
router.get("/", getLoyaltyInfo)
  
module.exports = router;