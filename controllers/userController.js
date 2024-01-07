require('dotenv')
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Wallet = require('../models/walletModel');
const Cart = require('../models/cartModel');

const { createNotification } = require('./notificationController')
const { createLoyaltyRecord } = require('./loyaltyController');
const { checkExpiredPoints } = require('./pointsController');

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

    const addressList = await Address.find({ userId: req.params.id }).sort({ createdAt: -1 });

    const wallet = await Wallet.findOne({ userId: req.params.id }).select('-loyaltyPoints')
    
    const date = new Date(user.birthday);
    const formattedDate = date.toISOString().split('T')[0];

    const formatBirthdayAndAddress = {
      ...user._doc,
      birthday: formattedDate,
      addressList,
      wallet: wallet ? wallet.walletBalance : 0
    }
    res.status(200).json(formatBirthdayAndAddress);
  } catch (error) {
    res.status(500).json({ message: 'Error getting user' });
  }
};

// Create a new user
const createUser = async (req, res) => {
    try {
      const { firstName, lastName, mobileNumber, email, password, birthday, gender, termandagree } = req.body;

      let emptyFields = []

      if (!firstName) {
        emptyFields.push('firstName')
      }
      if (!lastName) {
        emptyFields.push('lastName')
      }
      if (!mobileNumber) {
        emptyFields.push('mobileNumber')
      }
      if (!email) {
        emptyFields.push('email')
      }
      if (!password) {
        emptyFields.push('password')
      }
      if (!birthday) {
        emptyFields.push('birthday')
      }
      if (!gender) {
        emptyFields.push('gender')
      }
      if (!termandagree) {
        emptyFields.push('termandagree')
      }
      if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
      }
  
      // Check if user already exists with the provided email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user object with hashed password
      const newUser = new User({
        firstName,
        lastName,
        mobileNumber,
        email,
        birthday,
        gender,
        password: hashedPassword,
        termandagree: true,
        emailVerified: false
      });
      await newUser.save({ new: true });

      // Create a new wallet object
      const newWallet = new Wallet({
        userId: newUser._id,
        walletBalance: 0,
        loyaltyPoints: 0
      })
      await newWallet.save({ new: true });

      const loyaltyObject = await createLoyaltyRecord(newUser._id);
      
      const expiresIn = '24h';
      
      const token = jwt.sign({ userId: newUser._id, firstName: newUser.firstName, userEmail: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
  
      res.status(201).json({ token, firstName: newUser.firstName });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let emptyFields = []

    if (!email) {
      emptyFields.push('email')
    }
    if (!password) {
      emptyFields.push('password')
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    await checkExpiredPoints(user._id)

    const cartCount = await Cart.countDocuments({ userId: user._id })

    const expiresIn = '24h';

    const token = jwt.sign({ userId: user._id, firstName: user.firstName, userEmail: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn });

    res.status(200).json({ token, firstName: user.firstName, cartCount });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const _id = req.user.userId

    const { oldPassword, newPassword } = req.body

    const user = await User.findById({ _id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await createNotification(_id, 'changedPass')

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error update password:', error);
    res.status(500).json({ message: 'Error update password' });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, birthday, gender } = req.body;

    let emptyFields = []

    if (!firstName) {
      emptyFields.push('firstName')
    }
    if (!lastName) {
      emptyFields.push('lastName')
    }
    if (!mobileNumber) {
      emptyFields.push('mobileNumber')
    }
    if (!email) {
      emptyFields.push('email')
    }
    if (!birthday) {
      emptyFields.push('birthday')
    }
    if (!gender) {
      emptyFields.push('gender')
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await createNotification(user._id, 'updatedProfile', {})

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

const sendEmailVerification = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailVerifyPIN = crypto.randomInt(100000, 999999);

    const currentTime = new Date();
    const emailVerifyPinExp = new Date(currentTime.getTime() + 5 * 60000);

    user.emailCode = emailVerifyPIN;
    user.emailCodeExp = emailVerifyPinExp;

    await user.save();

    // THIS IS GMAIL SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'agoysleep@gmail.com', // Gmail email address
        pass: 'zzmxltzipifuqici', // Gmail email password
      },
    });
    
    await transporter.sendMail({
      from: `"no-reply AGOY Sleep Experience" <support@agoysleep.com>`, // sender address
      to: `${user.email}`, // list of receivers
      subject: `AGOY Account Email Verification`,
      html: `<p>Hello ${user.firstName},</p>

      <p>To verify your email address, please use the following PIN code:</p>
      
      <p>Verification PIN: ${emailVerifyPIN}</p>
      
      <p>Please note that this PIN code is valid for 5 minutes. After that, it will expire, and you will need to request a new PIN.</p>
      
      <p>If you did not initiate this verification process, please disregard this email.</p>
      
      <p>Best regards,</p>
      <p>AGOY Service Team</p>`,
    });

    res.status(200).json({ message: 'Email Verification Sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Error email verification' });
    console.log(error)
  }
}

const verifyEmailCode = async (req, res) => {
  try {
    const { verifyCode } = req.body;
    const { userId } = req.user;

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(400).json({ message: 'Invalid request!' });
    }

    const currentTime = new Date();
    const expireTime = new Date(user.emailCodeExp)

    if (user.emailCode === verifyCode) {
      if (expireTime < currentTime) {
        return res.status(498).json({ message: 'PIN Expired' });
      }
    }
    else {
      return res.status(401).json({ message: 'PIN Error' });
    }

    user.emailCode = undefined
    user.emailCodeExp = undefined
    user.emailVerified = true
    
    await user.save()

    res.status(200).json({ message: 'Verify email code accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
}

// FORGOT PASSWORD SMTP SETUP AND PROCESS
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetPIN = crypto.randomInt(100000, 999999);

    const currentTime = new Date();
    const pinExp = new Date(currentTime.getTime() + 5 * 60000);

    user.resetPIN = resetPIN;
    user.resetPINExp = pinExp;

    await user.save();

    // THIS IS GMAIL SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'agoysleep@gmail.com', // Gmail email address
        pass: 'zzmxltzipifuqici', // Gmail email password
      },
    });
    
    await transporter.sendMail({
      from: `"no-reply AGOY Sleep Experience" <support@agoysleep.com>`, // sender address
      to: `${email}`, // list of receivers
      subject: `GMAIL TEST`,
      html: `<p>Hi ${user.firstName},</p>
      <p>There was a request to change your password!</p>
      <p>If you did not make this request then please ignore this email.</p>
      <p>Otherwise, here's the pin to change your password: ${resetPIN}</p>`,
    });

    res.status(200).json({ message: 'Reset PIN Sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
}

const verifyPin = async (req, res) => {
  try {
    const { verifyPin, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid request!' });
    }

    const currentTime = new Date();
    const expireTime = new Date(user.resetPINExp)

    if (user.resetPIN === verifyPin) {
      if (expireTime < currentTime) {
        return res.status(498).json({ message: 'PIN Expired' });
      }
    }
    else {
      return res.status(401).json({ message: 'PIN Error' });
    }
    
    const expiresIn = '5m';

    const token = jwt.sign({ email: user.email }, process.env.FORGOT_PASS_SECRET_TOKEN, { expiresIn });

    user.resetPIN = undefined
    user.resetPINExp = undefined
    
    await user.save()

    res.status(200).json({ message: 'Reset PIN accepted', token });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
}

const resetPass = async (req, res) => {
  try {
    const { newPass } = req.body
    const { email } = req.user

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid request!' });
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    user.password = hashedPassword

    await user.save()

    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating password' });
  }
}

// CONTACT US SMTP SETUP AND PROCESS
const contactUs = async (req, res) => {
  try {
    const { formName, formEmail, formPhone, formSubject, formMessage } = req.body
    
    // THIS IS CPANEL SMTP
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // cPanel email address
        pass: process.env.SMTP_PASS, // cPanel email password
      },
    });

    await transporter.sendMail({
      from: `"${formName}" <${formEmail}>`, // sender address
      to: "support@agoysleep.com", // list of receivers
      subject: `${formSubject}`,
      html: `<p>Number: ${formPhone}</p><p>${formMessage}</p>`,
    });

    res.status(200).json({ message: 'Message successfully sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
}

const getUserPoints = async (req, res) => {
  try {
    // const { userId } = req.user
    const userId = req.params.id

    const points = await Wallet.find({ userId: userId }).select('-userId')

    if (!points) {
      return res.status(200).json({ walletBalance: 0, loyaltyPoints: 0 })
    }
    
    res.status(200).json(points)
  } catch (error) {
    res.status(500).json({ message: 'Error getting wallet' })
  }
}

const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user.userId } });
  res.send(users);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  updatePassword,
  contactUs,
  forgotPassword,
  verifyPin,
  resetPass,
  sendEmailVerification,
  verifyEmailCode,
  getUserPoints,
  searchUsers
};
