const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const uploadRoutes = require('./routes/upload');
const testas400Routes = require('./routes/upload');
const orderRoutes = require('./routes/order');
const orderTmpRoutes = require('./routes/ordertmp');
const as400Routes = require('./routes/as400Routes');
const uploadViewRoutes = require('./routes/uploadview');
const runCsharpRoutes = require('./routes/runCsharp');
const loginRoutes = require('./routes/loginRoutes'); 
const updateTmpRoutes = require('./routes/updateTmpRoutes');

const app = express();

// เปิดใช้งาน CORS
app.use(cors({
  origin: ['http://localhost:5002',
    'https://t3006.doodee.cc/',
    'https://tt.waiwaionline.com'],
  credentials: true
}));

// ตั้งค่า session ให้จำ login ไว้ 7 วัน
app.use(session({
  secret: 'your_secret_key_tum_tt',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // ต้องใช้ true ถ้าคุณใช้ HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 วัน (7 วัน * 24 ชั่วโมง * 60 นาที * 60 วินาที * 1000 milliseconds)
  }
}));
// ให้ Express อ่าน JSON requests
app.use(express.json());

// Static files - บริการไฟล์ HTML, CSS, JS จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// เพิ่ม Middleware ตรวจสอบการล็อกอิน
function checkAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next(); // ไปต่อถ้าผู้ใช้ล็อกอินแล้ว
  } else {
    return res.redirect('/login.html'); // ถ้ายังไม่ล็อกอิน ส่งไปที่ login
  }
}

// เส้นทางหน้า Login
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// เส้นทางหน้า Index (ต้องล็อกอินก่อน)
app.get('/index.html', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// เส้นทางหน้าอื่นๆ ที่ต้องการการล็อกอิน
app.get('/upload.html', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.get('/uploadview.html', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'uploadview.html'));
});

// API Routes
app.use('/api', uploadRoutes);
app.use('/api', testas400Routes);
app.use('/api', orderRoutes);
app.use('/api', orderTmpRoutes);
app.use('/api', as400Routes);
app.use('/api', uploadViewRoutes);
app.use('/api', runCsharpRoutes);
app.use('/api', loginRoutes);
app.use('/api', updateTmpRoutes);

// เปิดเซิร์ฟเวอร์บนพอร์ต 5002
app.listen(5002, () => {
  console.log('Server is running on port 5002');
});
