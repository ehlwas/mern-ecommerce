const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    referenceNumber: {
        type: Number,
        required: true
    },
    stripeId: {
        type: String,
        required: false
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverNumber: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    userSideOrderReceived: {
        type: Date,
        required: false
    },
    serverSideOrderReceived: {
        type: Date,
        required: false
    },
    deliveryFee: {
        type: Number,
        required: false
    },
    serviceFee: {
        type: Number,
        required: false
    },
    transactionTotalPriceAED: {
        type: Number,
        required: true
    },
    transactionTotalPriceUSD: {
        type: Number,
        required: true
    },
    transactionTotalPoints: {
        type: Number,
        required: false
    },
    transactionPointsUsed: {
        type: Number,
        required: false
    },
    transactionWalletUsed: {
        type: Number,
        required: false
    },
    guestEmail: {
        type: String,
        required: false
    },
    discountCode: {
        type: String,
        required: false
    },
    discountType: {
        type: String,
        required: false
    },
    discount: {
        type: String,
        required: false
    }

}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)
