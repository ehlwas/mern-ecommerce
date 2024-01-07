const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    transactionReferenceNumber: {
        type: Number,
        required: false
    },
    points: {
        type: Number,
        required: true
    },
    pointsType: {
        type: String,
        required: true
    },
    pointsExpiration: {
        type: Date,
        required: true
    },
    expirationEffect: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Points', pointsSchema)
