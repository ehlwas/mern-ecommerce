const express = require('express');
const {
  getTransactions,
  getTransactionDetails
} = require('../controllers/transactionController');

const router = express.Router();

// Routes
router.get('/list/:filter', getTransactions);
router.get('/:id', getTransactionDetails);

module.exports = router;