const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    urlId: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    specs: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: false
    },
    headerImg: {
        type: String,
        required: false
    },
    headerDescription: {
        type: String,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
