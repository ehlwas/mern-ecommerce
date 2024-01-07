const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionItemSchema = new Schema({
    transactionId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    sizeId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPriceAED: {
        type: Number,
        required: true
    },
    totalPriceUSD: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('TransactionItem', transactionItemSchema)
