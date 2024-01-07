const express = require('express');
const {
    addToCart,
    getUserCart,
    checkoutCart,
    updateQuantity,
    removeCart,
    checkoutProcess,
    readyCheckout
} = require('../controllers/cartController');

const router = express.Router();

const authCart = require('../middleware/authCart')

// Routes
router.get('/userCart', getUserCart);
router.post('/add', addToCart);
router.post('/checkout', checkoutCart);
router.post('/updateQuantity', updateQuantity);
router.delete('/remove/:id', removeCart);
router.post('/checkoutProcess', authCart, checkoutProcess);
router.get('/checkoutReady', readyCheckout);

module.exports = router;