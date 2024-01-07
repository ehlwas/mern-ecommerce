const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    addressName: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverNumber: {
        type: String,
        required: true
    },
    addressLine: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Address', addressSchema)
