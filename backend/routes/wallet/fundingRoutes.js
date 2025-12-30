const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const fundingController = require('../../controllers/wallet/fundingController');
console.log("auth type:", typeof auth);
console.log("fakeFund type:", typeof fundingController.fakeFund);


router.post('/fake', auth, fundingController.fakeFund);

module.exports = router;