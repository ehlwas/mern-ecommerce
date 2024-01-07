const express = require("express");

const {
    getPointsList,
} = require('../controllers/pointsController')

const router = express.Router();

// ROUTES
router.get("/filter=:filter", getPointsList)
  
module.exports = router;