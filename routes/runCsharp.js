const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// สร้าง Route POST สำหรับเรียกใช้งานแอป C#
router.post('/run-csharp-app', (req, res) => {
  // เรียกใช้ไฟล์ .exe ของแอปพลิเคชัน C# ที่อยู่ในเซิร์ฟเวอร์
  //exec('C:/AppWork/OnlineShopTiktok/OnlineShopTiktok/bin/Debug/TiktokApp.exe', (error, stdout, stderr) => {
  exec('C:/AppWork/UploadTiktokShop/bin/Debug/net8.0-windows/UploadTiktokShop.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ message: 'ส่งข้อมูลเข้า As400 ไม่ได้ #error ' + error.message });
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ message: 'ส่งข้อมูลเข้า As400 ไม่ได้ #stderr ' + error.message  });
    }

    console.log(`stdout: ${stdout}`);
    res.json({ message: 'ส่งข้อมูลเข้า AS400 สำเร็จ' });
  });
});

module.exports = router;