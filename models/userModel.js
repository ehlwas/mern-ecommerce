const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  termandagree: {
    type: Boolean,
    required: false
  },
  resetPIN: {
    type: Number,
    required: false
  },
  resetPINExp: {
    type: Date,
    required: false
  },
  emailCode: {
    type: Number,
    required: false
  },
  emailCodeExp: {
    type: Date,
    required: false
  },
  emailVerified: {
    type: Boolean,
    required: false
  }
});

// Create the User model
module.exports = mongoose.model('User', userSchema);