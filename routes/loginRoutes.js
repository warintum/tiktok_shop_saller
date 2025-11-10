const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // การเชื่อมต่อฐานข้อมูล
//const bcrypt = require('bcrypt');


// Endpoint สำหรับการล็อกอิน
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

   /* // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // เก็บข้อมูลผู้ใช้ลงใน session
    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful' });*/

     // ตรวจสอบรหัสผ่านโดยตรง
     if (password === user.password) {
        // เก็บข้อมูลผู้ใช้ลงใน session
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 วัน
        req.session.userId = user.id;
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// ตรวจสอบการล็อกอิน
router.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(401).json({ isLoggedIn: false });
  }
});
  
  // เส้นทาง Logout
  router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // ลบ cookie ของ session
      res.status(200).json({ message: 'Logout successful' });
    });
  });
  

module.exports = router;
