const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  sendEmailVerification,
  verifyEmailCode,
  getUserPoints,
  searchUsers
} = require('../controllers/userController');

const router = express.Router();

// Routes
router.get('/', getUsers);
router.get('/find', searchUsers);
router.get('/:id', getUserById);
router.get('/wallet/:id', getUserPoints);
// router.post('/', createUser); PUBLIC ROUTE
// router.post('/login', loginUser); PUBLIC ROUTE
router.post('/:id', updateUser);
router.post('/u/pw', updatePassword);
router.post('/send/emailverify', sendEmailVerification);
router.post('/verify/emailcode', verifyEmailCode);
// router.delete('/:id', deleteUser);

module.exports = router;
