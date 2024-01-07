const express = require("express");
// const multer = require("multer");

const { 
    createGroups,    
    getGroups
} = require('../controllers/groupController')

// const upload = multer();

const router = express.Router();

// ROUTES
router.get("/", getGroups)
router.post("/", createGroups)
  
module.exports = router;