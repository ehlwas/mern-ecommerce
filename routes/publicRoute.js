const express = require('express');

const {
  createUser,
  loginUser,
  contactUs,
  forgotPassword,
  verifyPin,
  resetPass
} = require('../controllers/userController');
const { getGuestCart, readyCheckoutGuest, checkoutCartGuest, checkoutProcessGuest, guestCartConfig, guestCartPaymentIntent, verifyDiscountCode } = require('../controllers/cartController');
const { getTransactionDetailsGuest } = require('../controllers/transactionController');
const { updateSizesWithRandomPoints } = require('../controllers/sizeController');

const authForPass = require('../middleware/authForPass')
const authCartGuest = require('../middleware/authCartGuest')

const router = express.Router();

router.get('/track/:refNum', getTransactionDetailsGuest);

// CART AND CHECKOUT
router.post('/getGuestCart', getGuestCart);
router.post('/checkoutReadyGuest', readyCheckoutGuest);
router.post('/checkoutCartGuest', checkoutCartGuest);
router.post('/checkoutCartGuest', checkoutCartGuest);
router.post('/checkoutProcess', authCartGuest, checkoutProcessGuest);
router.get('/cartguest/config', guestCartConfig)
router.post('/cartguest/create-payment-intent', guestCartPaymentIntent)
router.get('/updateSizePoints', updateSizesWithRandomPoints)
router.get('/updateSizePoints', updateSizesWithRandomPoints)
router.post('/verifyDiscountCode', verifyDiscountCode);

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/contactus', contactUs);
router.post('/forgotpass', forgotPassword);
router.post('/verifypin', verifyPin);
router.post('/resetpass', authForPass, resetPass);

module.exports = router;