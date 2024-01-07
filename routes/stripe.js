const express = require('express');
const {
    paymentCharge,
    templatedPayment
} = require('../controllers/stripeController');

const router = express.Router();

// Routes
router.get('/createToken', paymentCharge);
router.get('/testpayment', templatedPayment);

module.exports = router;