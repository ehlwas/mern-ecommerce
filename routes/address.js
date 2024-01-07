const express = require('express');
const {
  createAddress,
  updateAddress,
  removeAddress
} = require('../controllers/addressController');

const router = express.Router();

// Routes
router.post('/add', createAddress);
router.post('/:id', updateAddress);
router.post('/remove/:id', removeAddress);

module.exports = router;