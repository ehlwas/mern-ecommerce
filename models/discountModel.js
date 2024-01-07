const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discountSchema = new Schema({
    userId: {
        type: String,
        required: false
    },
    transactionId: {
        type: String,
        required: false
    },
    discountCode: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Discount', discountSchema)