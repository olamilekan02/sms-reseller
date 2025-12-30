const express = require('express');
const router = express.Router();
const { addProvider, getProviders } = require('../../controllers/admin/providerController');

router.post('/add', addProvider);
router.get('/', getProviders);

module.exports = router;
