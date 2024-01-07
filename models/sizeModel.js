const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sizeSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    priceUSD: {
        type: Number,
        required: true
    },
    priceAED: {
        type: Number,
        required: true
    },
    stocks: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Size', sizeSchema)
