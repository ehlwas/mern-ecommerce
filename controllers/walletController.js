const Wallet = require("../models/walletModel");
const mongoose = require("mongoose");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { createNotification } = require('./notificationController')

const createWalletRecord = async (userId) => {
  try {
    const newWallet = new Wallet({
      userId,
      walletBalance: 0,
      loyaltyPoints: 0
    })

    const walletObject = await newWallet.save()

    return walletObject
  } catch (error) {
    console.log(error)
  }
}

const topUpWallet = async (req, res) => {
  try {
    const { paymentIntentId } = req.body
    const { userId } = req.user;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const unixTimestamp = paymentIntent.created;
    const nowTime = new Date().getTime() / 1000;
    
    const fiveMinutesAgo = nowTime - 300;
    
    if (unixTimestamp <= fiveMinutesAgo) {
      return res.status(500).json({ message: "Payment Intent Expired"})
    }

    let wallet = await Wallet.findOne({ userId })

    const formattedWalletAmount = await (paymentIntent.amount / 100).toFixed(2);
    
    if (!wallet) {
      const newWallet = new Wallet({
        userId,
        loyaltyPoints: 0,
        walletBalance: formattedWalletAmount
      })
      await newWallet.save()

      wallet = newWallet
    } else {
      wallet.walletBalance = wallet.walletBalance + parseFloat(formattedWalletAmount)
      await wallet.save()
    }

    await createNotification(userId, 'topup', {amount: parseFloat(formattedWalletAmount)})

    return res.status(200).json({ message: "Top Up successfull", newWalletBalance: wallet.walletBalance })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error Top Up" });
  }
};

module.exports = {
  topUpWallet,
  createWalletRecord
};
