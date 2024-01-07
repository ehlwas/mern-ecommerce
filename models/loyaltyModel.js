const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loyaltySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    membershipNumber: {
        type: Number,
        required: true
    },
    loyaltyTier: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Loyalty', loyaltySchema)
