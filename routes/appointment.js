const express = require("express");

const { 
    createAppointment,
    getUnavailableDates,
    getUnavailableTime
} = require('../controllers/appointmentController')

const router = express.Router();

// ROUTES
router.post("/setAppointment", createAppointment)
router.post("/getUnavailableDates", getUnavailableDates)
router.post("/getUnavailableTime", getUnavailableTime)
  
module.exports = router;