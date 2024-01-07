const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
