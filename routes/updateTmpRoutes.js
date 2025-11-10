const express = require('express');
const router = express.Router();
const updateTmpController = require('../controllers/updateTmpController');

// เส้นทางสำหรับอัปเดตข้อมูลใน ttorder_tmp
router.post('/update-order/:orderId', updateTmpController.updateOrder);

module.exports = router;
