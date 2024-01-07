const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: {
        type: String,
        required: false
    },
    transactionItemId: {
        type: String,
        required: true
    },
    transactionNumber: {
        type: String,
        required: true
    },
    guestName: {
        type: String,
        required: false
    },
    reviewMessage: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)
