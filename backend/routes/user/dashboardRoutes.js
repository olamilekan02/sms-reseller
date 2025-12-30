const express = require('express');
const router = express.Router();
const { auth } = require("../../middleware/auth");
const {
  getMyNumbers,
  getMessagesForNumber
} = require('../../controllers/user/dashboardController');

router.get('/numbers', auth, getMyNumbers);
router.get('/messages/:numberId', auth, getMessagesForNumber);

module.exports = router;
