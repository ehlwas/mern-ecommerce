const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const walletSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    walletBalance: {
        type: Number,
        required: true
    },
    loyaltyPoints: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Wallet', walletSchema)
