const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    groupId: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)
