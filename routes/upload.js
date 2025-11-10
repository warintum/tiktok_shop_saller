const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const router = express.Router();
const odbc = require('odbc');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadController.uploadCSV);

router.get('/test-as400', async (req, res) => {
    try {
      const connection = await odbc.connect('Dsn=LIBBPCSCDF;uid=ssa;pwd=ssa');
      await connection.close();
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

module.exports = router;
