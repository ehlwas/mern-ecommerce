const express = require("express");

const { 
    getSizes,
    createSizes    
} = require('../controllers/sizeController')

const router = express.Router();

// ROUTES
router.get("/", getSizes)
router.post("/", createSizes)
  
module.exports = router;