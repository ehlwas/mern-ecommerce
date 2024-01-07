const express = require('express');
const {
  getNotificationList,
  readAll,
  readNotification
} = require('../controllers/notificationController');

const router = express.Router();

// Routes
router.post('/getList', getNotificationList);
router.post('/readAll', readAll);
router.post('/readNotification', readNotification);

module.exports = router;