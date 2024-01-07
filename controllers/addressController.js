require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const Address = require('../models/addressModel');

const { createNotification } = require('./notificationController')

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressList = await Address.find({ userId: req.params.id }).select('-_id');

    const date = new Date(user.birthday);
    const formattedDate = date.toISOString().split('T')[0];

    const formatBirthdayAndAddress = {
      ...user._doc,
      birthday: formattedDate,
      addressList
    }
    res.status(200).json(formatBirthdayAndAddress);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};

// Create a new user
const createAddress = async (req, res) => {
    try {
      const userId = req.user.userId
      const { addressName, receiverName, receiverNumber, addressLine, landmark, city, state, zipCode } = req.body;
  
      // Create a new user object with hashed password
      const newAddress = new Address({
        userId,
        addressName,
        receiverName, 
        receiverNumber, 
        addressLine, 
        landmark, 
        city, 
        state, 
        zipCode
      });
  
      // Save the user to the database
      await newAddress.save();

      await createNotification(userId, 'addedAddress', {addressTitle: addressName})
  
      res.status(201).json(newAddress);
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ message: 'Error creating address' });
    }
};

// Update a user by ID
const updateAddress = async (req, res) => {
  try {
    const user = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!user) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    await createNotification(user.userId, 'updatedAddress', {addressTitle: user.addressName})

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete a user by ID
const removeAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    await createNotification(address.userId, 'removedAddress', {addressTitle: address.addressName})
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Error deleting address' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createAddress,
  updateAddress,
  removeAddress
};
