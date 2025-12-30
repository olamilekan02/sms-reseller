const express = require('express');
const router = express.Router();
const { receiveSms } = require('../../controllers/provider/smsWebhookController');

router.post('/receive', receiveSms);

module.exports = router;
