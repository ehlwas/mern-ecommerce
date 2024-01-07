require('dotenv')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

const { createNotification } = require('./notificationController')

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Size = require('../models/sizeModel');
const Transaction = require('../models/transactionModel');
const TransactionItem = require('../models/transactionItemModel');
const Address = require('../models/addressModel');
const Wallet = require('../models/walletModel');
const Points = require('../models/pointsModel');
const Discount = require('../models/discountModel');
const { createPointsRecord } = require('./pointsController');
const { addTotalPoints } = require('./loyaltyController');

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.userId

    const cartList = await Cart.aggregate([
      {
        $match: { userId }
      },
      {
        $addFields: {
          productId: { $toObjectId: '$productId' },
          sizeId : { $toObjectId: '$sizeId' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productData'
        }
      },
      {
        $lookup: {
          from: 'sizes',
          localField: 'sizeId',
          foreignField: '_id',
          as: 'sizeData'
        }
      },
      {
        $project: {
          quantity: 1,
          priceAED: 1,
          priceUSD: 1,
          totalPriceAED: 1,
          totalPriceUSD: 1,
          'productData.model': 1,
          'productData.color': 1,
          'productData.imageUrl': 1,
          'sizeData.size': 1,
          'sizeData.priceUSD': 1,
          'sizeData.priceAED': 1,
          _id: 1 // Exclude the _id field
        }
      }
    ]);
  
    res.status(200).json(cartList);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the user cart.' });
  }
}

const addToCart = async (req, res) => {
    try {
      const userId = req.user.userId
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { productId, sizeId } = req.body

      // Get the size for the Price
      const size = await Size.findById(sizeId)

      // Check if Product in Cart already exists
      const existingCart = await Cart.findOne({ userId, productId, sizeId });
      if (existingCart) {
        const newQuantity = existingCart.quantity + 1;

        const newTotalPriceAED = size.priceAED * newQuantity
        const newTotalPriceUSD = size.priceUSD * newQuantity
        const newTotalPoints = size.points * newQuantity

        const updatedCart = await Cart.findOneAndUpdate(
          { _id: existingCart._id },
          {
            $set: {
              quantity: newQuantity,
              priceAED: size.priceAED,
              priceUSD: size.priceUSD,
              totalPriceAED: newTotalPriceAED.toFixed(2),
              totalPriceUSD: newTotalPriceUSD.toFixed(2),
              points: newTotalPoints.toFixed(1)
            }
          },
          { new: true } // Retrieve the updated document
        );

        res.status(200).json({ added: 0 });
      }
      else {
        const newCart = new Cart({
          userId,
          productId,
          sizeId,
          quantity: 1,
          totalPriceAED: size.priceAED.toFixed(2),
          totalPriceUSD: size.priceUSD.toFixed(2),
          points: size.points
        });
    
        // Save the user to the database
        await newCart.save();
    
        res.status(201).json({ added: 1 });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
};

const updateQuantity = async (req, res) => {
  try {
    const _id = req.body.id
    const quantity = req.body.quantity
    
    const cart = await Cart.findById({ _id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const setSizeId = cart.sizeId

    const getSize = await Size.findById({ _id: setSizeId })

    cart.quantity = quantity
    cart.totalPriceAED = (getSize.priceAED * quantity).toFixed(2)
    cart.totalPriceUSD = (getSize.priceUSD * quantity).toFixed(2)
    cart.points = (getSize.points * quantity).toFixed(1)

    await cart.save()
    
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

const removeCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ message: 'Error deleting cart' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!user) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Cart.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const { userId, userEmail } = req.user;
    const { addressId, paymentMethod, paymentIntent, userCart, pointsUsed, discountCode } = req.body

    const cartIds = JSON.parse(userCart)

    if (!cartIds) {
      return res.status(400).json({ error: 'Bad request' })
    }

    const addressData = await Address.findById(addressId)

    if (!addressData) {
      return res.status(400).json({ error: 'Address Not Found' })
    }

    let paymentData = ''

    if (paymentMethod === 'cc') paymentData = 'Credit Card'
    else if (paymentMethod === 'cod') paymentData = 'Cash on Delivery'
    else if (paymentMethod === 'wallet') paymentData = 'Wallet'

    if (paymentData === '') {
      return res.status(400).json({ error: 'Error Payment Method' })
    }

    const expiresIn = '12h';

    let discount;

    if (discountCode) {
      discount = await Discount.findOne({ discountCode })

      if (!discount) {
        return res.status(500).json({ message: 'Error Payment.' })
      }
    }

    if (paymentMethod === 'cc') {
      const cartToken = jwt.sign({ cartIds, addressData, paymentData, pointsUsed, stripeId: paymentIntent, discountCode: discount ? discountCode : '' }, process.env.CART_TOKEN_SECRET, { expiresIn });
      return res.status(200).json({ cartToken })
    }
    else if (paymentMethod === 'cod' || paymentMethod === 'wallet') {
      const cartToken = jwt.sign({ cartIds, addressData, pointsUsed, paymentData, stripeId: '', discountCode: discount ? discountCode : '' }, process.env.CART_TOKEN_SECRET, { expiresIn });
      return res.status(200).json({ cartToken })
    }
    else {
      return res.status(402).json({ message: "Error Payment Method" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const readyCheckout = async (req, res) => {
  const { userId } = req.user;

  try {
    const cartList = await Cart.aggregate([
      { $match: { userId: userId } },
      {
        $addFields: {
          productId: { $toObjectId: '$productId' },
          sizeId : { $toObjectId: '$sizeId' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productData'
        }
      },
      {
        $lookup: {
          from: 'sizes',
          localField: 'sizeId',
          foreignField: '_id',
          as: 'sizeData'
        }
      },
      {
        $project: {
          quantity: 1,
          priceAED: 1,
          priceUSD: 1,
          totalPriceAED: 1,
          totalPriceUSD: 1,
          'productData.model': 1,
          'productData.color': 1,
          'productData.imageUrl': 1,
          'sizeData.size': 1,
          'sizeData.priceUSD': 1,
          'sizeData.priceAED': 1,
          _id: 1 // Exclude the _id field
        }
      }
    ]).exec();

    const addressList = await Address.find({ userId: userId }).sort({ createdAt: -1 });

    const wallet = await Wallet.findOne({ userId: userId }).select('-userId -__v -_id -createdAt -updatedAt')

    res.status(200).json({ cartList, addressList, wallet: wallet ? wallet : {walletBalance: 0, loyaltyPoints: 0} });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const checkoutProcess = async (req, res) => {
  const { userId } = req.user;
  const { cartIds, stripeId, paymentData, addressData, pointsUsed, discountCode } = req.cartData;

  try {
    let payment_intent = stripeId

    const itemList = await Cart.find({ _id: { $in: cartIds } });

    const totalPriceAEDHandler = itemList.reduce(function (prev, current) {
      return prev + +current.totalPriceAED;
    }, 0).toFixed(2)

    const totalPriceUSDHandler = itemList.reduce(function (prev, current) {
      return prev + +current.totalPriceUSD;
    }, 0).toFixed(2)

    let totalPriceAED = totalPriceAEDHandler

    let totalPriceUSD = totalPriceUSDHandler

    const totalPoints = itemList.reduce(function (prev, current) {
      return prev + +current.points;
    }, 0).toFixed(1)

    let discount;

    if (discountCode) {
      discount = await Discount.findOne({ discountCode })

      if (discount.discountType === "Money") {
        (totalPriceAED -= discount.discount).toFixed(2)
        (totalPriceUSD -= discount.discount).toFixed(2)
      } else if (discount.discountType === "Percentage") {
        totalPriceAED = (totalPriceAED - (totalPriceAED * (discount.discount / 100))).toFixed(2)
        totalPriceUSD = (totalPriceUSD - (totalPriceUSD * (discount.discount / 100))).toFixed(2)
      }

      await discount.save()
    }

    let walletBalance = await Wallet.findOne({ userId: userId });

    if (!walletBalance) {
      const newWallet = new Wallet({
        userId,
        walletBalance: 0,
        loyaltyPoints: 0
      })
      walletBalance = await newWallet.save({ new: true })
    }

    if (walletBalance.loyaltyPoints < pointsUsed) {
      return res.status(400).json({ error: 'Bad request' })
    }

    totalPriceAED -= pointsUsed
    totalPriceUSD -= pointsUsed

    let walletUsed;

    if (paymentData === 'Wallet') {
      if (walletBalance.walletBalance < totalPriceAED) {
        return res.status(400).json({ error: 'Bad request' })
      }
      walletUsed = totalPriceAED;
      walletBalance.walletBalance = walletBalance.walletBalance - totalPriceAED;
      await walletBalance.save();
    }
    
    walletBalance.loyaltyPoints = ((parseFloat(walletBalance.loyaltyPoints) + parseFloat(totalPoints)) - parseFloat(pointsUsed)).toFixed(1);
    await walletBalance.save()

    let referenceNumber;
    let isUnique = false;

    while (!isUnique) {
      referenceNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const existingProduct = await Product.findOne({ referenceNumber });

      if (!existingProduct) {
        isUnique = true;
      }
    }

    await createPointsRecord(userId, totalPoints, 'Earned', referenceNumber);
    await addTotalPoints(userId, totalPoints)

    if (pointsUsed !== 0) {
      await createPointsRecord(userId, pointsUsed, 'Spend', referenceNumber);
    }

    const newTransaction = new Transaction({
      userId,
      referenceNumber,
      stripeId: paymentData === 'Credit Card' ? payment_intent : 'N/A',
      paymentMethod: paymentData,
      status: "Pending",
      receiverName: addressData.receiverName,
      receiverNumber: addressData.receiverNumber,
      deliveryAddress: `${addressData.addressLine} (${addressData.landmark}) ${addressData.city}, ${addressData.state}, ${addressData.zipCode}`,
      transactionTotalPriceAED: totalPriceAED,
      transactionTotalPriceUSD: totalPriceUSD,
      transactionTotalPoints: totalPoints,
      transactionPointsUsed: pointsUsed,
      transactionWalletUsed: walletUsed,
      discountCode: discount ? discount.discountCode : '',
      discountType: discount ? discount.discountType : '',
      discount: discount ? discount.discount : ''
    })

    const transactionData = await newTransaction.save()

    const transactionItems = await itemList.map(item => ({
      transactionId: transactionData._id,
      ...item.toObject()
    }));

    await TransactionItem.insertMany(transactionItems);

    await Cart.deleteMany({ _id: { $in: cartIds } })

    await createNotification(userId, 'ordered', {referenceNumber})
    await createNotification(userId, 'gainedPoints', { points: totalPoints, referenceNumber })

    res.status(200).json({ message: "Saved successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e)
  }
};

const verifyDiscountCode = async (req, res) => {
  try {
    const { discountCode } = req.body;

    const discount = await Discount.findOne({ discountCode });

    if (!discount) {
      return res.status(404).json({ discount: false, message: 'Discount code not found.' })
    }

    res.status(200).json({ discount })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GUEST ACCOUNT FUNCTIONS

const getGuestCart = async (req, res) => {
  try {
    const cartItems = req.body
    
    const productIds = cartItems.map(item => item.productId);
    const sizeIds = cartItems.map(item => item.sizeId);
    
    // Query the Product Collection to get the Product Data
    const products = await Product.find({ _id: { $in: productIds } }).select('model color imageUrl');
    
    // Query the Size Collection to get the Size Data
    const sizes = await Size.find({ _id: { $in: sizeIds } }).select('size priceUSD priceAED');
    
    // Combine the Product Data and Size Data
    const cartList = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      const size = sizes.find(s => s._id.toString() === item.sizeId);
      return {
        quantity: item.quantity,
        totalPriceAED: (size.priceAED * item.quantity).toFixed(2),
        totalPriceUSD: (size.priceUSD * item.quantity).toFixed(2),
        productData: [product],
        sizeData: [size]
      };
    });
    
    res.status(200).json(cartList);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the user cart.' });
    console.log(error)
  }
}

const readyCheckoutGuest = async (req, res) => {
  try {
    const cartItems = req.body
    
    const productIds = cartItems.map(item => item.productId);
    const sizeIds = cartItems.map(item => item.sizeId);
    
    // Query the Product Collection to get the Product Data
    const products = await Product.find({ _id: { $in: productIds } }).select('model color imageUrl');
    
    // Query the Size Collection to get the Size Data
    const sizes = await Size.find({ _id: { $in: sizeIds } }).select('size priceUSD priceAED');
    
    // Combine the Product Data and Size Data
    const cartList = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      const size = sizes.find(s => s._id.toString() === item.sizeId);
      return {
        quantity: item.quantity,
        totalPriceAED: (size.priceAED * item.quantity).toFixed(2),
        totalPriceUSD: (size.priceUSD * item.quantity).toFixed(2),
        productData: [product],
        sizeData: [size]
      };
    });

    res.status(200).json({ cartList, addressList: false });
  } catch (e) {
    res.status(500).json({ error: 'An error occurred while retrieving the user cart.' });
  }
}

const checkoutCartGuest = async (req, res) => {
  try {
    const { cartItems, addressData, paymentMethod, paymentIntent, guestEmail, discountCode } = req.body
    
    const productIds = cartItems.map(item => item.productId);
    const sizeIds = cartItems.map(item => item.sizeId);
    
    // Query the Product Collection to get the Product Data
    const products = await Product.find({ _id: { $in: productIds } }).select('model color imageUrl');
    
    // Query the Size Collection to get the Size Data
    const sizes = await Size.find({ _id: { $in: sizeIds } }).select('size priceUSD priceAED');
    
    // Combine the Product Data and Size Data
    const carts = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      const size = sizes.find(s => s._id.toString() === item.sizeId);
      return {
        quantity: item.quantity,
        totalPriceAED: (size.priceAED * item.quantity).toFixed(2),
        totalPriceUSD: (size.priceUSD * item.quantity).toFixed(2),
        productData: [product],
        sizeData: [size]
      };
    });

    if (!carts) {
      return res.status(400).json({ error: 'Bad request' })
    }

    let paymentData = ''

    if (paymentMethod === 'cc') paymentData = 'Credit Card'

    if (paymentData === '') {
      return res.status(400).json({ error: 'Error Payment Method' })
    }

    const expiresIn = '2h';

    let discount;

    if (discountCode) {
      discount = await Discount.findOne({ discountCode })

      if (!discount) {
        return res.status(500).json({ message: 'Error Payment.' })
      }
    }

    if (paymentMethod === 'cc') {
      const cartToken = jwt.sign({ cartItems, addressData, paymentData, stripeId: paymentIntent, guestEmail, discountCode: discount ? discountCode : '' }, process.env.CART_TOKEN_SECRET_GUEST, { expiresIn });
      return res.status(200).json({ cartToken })
    }
    else {
      return res.status(402).json({ message: "Error Payment Method" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const checkoutProcessGuest = async (req, res) => {
  const { cartItems, stripeId, paymentData, addressData, discountCode } = req.cartData;

  try {
    const sizeIds = cartItems.map(item => item.sizeId);
    
    // Query the Size Collection to get the Size Data
    const sizes = await Size.find({ _id: { $in: sizeIds } }).select('size priceUSD priceAED');
    
    // Combine the Product Data and Size Data
    const itemList = cartItems.map(item => {
      const size = sizes.find(s => s._id.toString() === item.sizeId);
      return {
        ...item,
        userId: "N/A",
        totalPriceAED: (size.priceAED * item.quantity).toFixed(2),
        totalPriceUSD: (size.priceUSD * item.quantity).toFixed(2),
      };
    });

    const totalPriceAED = itemList.reduce(function (prev, current) {
      return prev + +current.totalPriceAED;
    }, 0).toFixed(2)

    const totalPriceUSD = itemList.reduce(function (prev, current) {
      return prev + +current.totalPriceUSD;
    }, 0).toFixed(2)

    let referenceNumber;
    let isUnique = false;

    while (!isUnique) {
      referenceNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const existingProduct = await Product.findOne({ referenceNumber });

      if (!existingProduct) {
        isUnique = true;
      }
    }

    const newTransaction = new Transaction({
      userId: 'N/A',
      referenceNumber,
      stripeId: stripeId,
      paymentMethod: paymentData,
      status: "Pending",
      receiverName: addressData.receiverName,
      receiverNumber: addressData.receiverNumber,
      deliveryAddress: `${addressData.addressLine} (${addressData.landmark}) ${addressData.city}, ${addressData.state}, ${addressData.zipCode}`,
      transactionTotalPriceAED: totalPriceAED,
      transactionTotalPriceUSD: totalPriceUSD,
      guestEmail: addressData.guestEmail
    })

    if (discountCode) {
      const discount = await Discount.findOne({ discountCode })

      newTransaction.discountCode = discount.discountCode
      newTransaction.discountType = discount.discountType
      newTransaction.discount = discount.discount
    }

    const transactionData = await newTransaction.save()

    const transactionItems = await itemList.map(item => ({
      transactionId: transactionData._id.toString(),
      ...item
    }));

    await TransactionItem.insertMany(transactionItems);

    const dateToday = new Date()

    // THIS IS GMAIL SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'agoysleep@gmail.com', // Gmail email address
        pass: 'zzmxltzipifuqici', // Gmail email password
      },
    });
    
    await transporter.sendMail({
      from: `"AGOY Sleep Experience" <support@agoysleep.com>`, // sender address
      to: `${addressData.guestEmail}`, // list of receivers
      subject: `AGOY Order Details and Reference Number`,
      html: `
      <p>Dear ${addressData.receiverName},</p>
    
      <p>Thank you for your order!</p>
      
      <p>Order Reference: <strong>${referenceNumber}</strong></p>
      
      <p>Order Date: ${dateToday.toDateString()}</p>
      
      <p>Shipping Address:<br>
        ${addressData.addressLine} (${addressData.landmark}) ${addressData.city}, ${addressData.state}, ${addressData.zipCode}
      </p>
      
      <p>Total Amount: ${totalPriceAED} AED</p>
      
      <p>We are processing your order with utmost care, and it will be on its way to you soon.</p>
      
      <p>If you have any questions or need assistance, feel free to contact our support team at support@agoysleep.com.</p>
      
      <p>Thank you for choosing AGOY Sleep Experience. We look forward to serving you again!</p>
      
      <p>Best regards,</p>
      <p>AGOY Sleep Experience<br>
        support@agoysleep.com</p>`,
    });

    res.status(200).json({ message: "Saved successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const formatPrice = (price) => {
  if (typeof price === 'number') {
    if (Number.isInteger(price)) {
      return price * 100;
    } else {
      return Math.round(price * 100);
    }
  } else {
    throw new Error('Invalid price format');
  }
}

const guestCartConfig = async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
}

const guestCartPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body
    const formattedPrice = formatPrice(price);
    
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "AED",
      amount: formattedPrice,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  addToCart,
  getUserCart,
  updateUser,
  deleteUser,
  checkoutCart,
  updateQuantity,
  removeCart,
  checkoutProcess,
  readyCheckout,
  getGuestCart,
  readyCheckoutGuest,
  checkoutCartGuest,
  checkoutProcessGuest,
  guestCartConfig,
  guestCartPaymentIntent,
  verifyDiscountCode
};
