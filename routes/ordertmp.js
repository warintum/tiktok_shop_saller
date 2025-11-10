const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderTmpController');

router.get('/orderstmp', orderController.getOrders);

module.exports = router;
