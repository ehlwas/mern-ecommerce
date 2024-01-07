const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    userId: {
        type: String,
        required: false
    },
    guestName: {
        type: String,
        required: false
    },
    scheduledDateTime: {
        type: Date,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema)
