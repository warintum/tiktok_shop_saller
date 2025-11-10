const express = require('express');
const router = express.Router();
const as400Controller = require('../controllers/as400Controller');

// เส้นทางสำหรับการส่งข้อมูลไปยัง AS400
router.post('/send-as400', as400Controller.sendDataToAS400);

module.exports = router;
