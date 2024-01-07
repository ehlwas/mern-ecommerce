const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ccardSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    ccName: {
        type: String,
        required: true
    },
    ccType: {
        type: String,
        required: true
    },
    ccNumber: {
        type: Number,
        required: true
    },
    ccMonth: {
        type: Number,
        required: true
    },
    ccYear: {
        type: Number,
        required: true
    },
    ccCvc: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('CreditCards', ccardSchema)
