const express = require('express');
const router = express.Router();
const odbc = require('odbc');
const iconv = require('iconv-lite');
const convertthaiFromAs400 = require('../controllers/thaiFromAs400')

// ดึงข้อมูลจาก PMONHT
router.get('/uploadview', async (req, res) => {
    try {
        //const connection = await odbc.connect('Dsn=TESTF;uid=ssa;pwd=ssa');
        const connection = await odbc.connect('Dsn=LIBBPCSCDF;uid=ssa;pwd=ssa;CCSID=1208');
        // Query ดึงข้อมูลจากตาราง PMONHT
        const result = await connection.query(`
            SELECT OHBIL, OHPMD, OHCNM, OHTEL, OHAD1, OHTAM, OHDAM
            FROM PMONHT
            FETCH FIRST 500 ROWS ONLY
        `);

        // แปลงข้อความที่เป็นภาษาไทยจาก encoding ของ AS400 เป็น UTF-8
        const convertedResult = result.map(row => ({
            OHBIL: row.OHBIL,
            OHPMD: row.OHPMD,
            OHCNM: convertthaiFromAs400(row.OHCNM), // แปลงจาก TIS-620 (หรือ encoding ของ AS400) เป็น UTF-8
            OHTEL: row.OHTEL,
            OHAD1: convertthaiFromAs400(row.OHAD1), // แปลงจาก TIS-620 (หรือ encoding ของ AS400) เป็น UTF-8
            OHTAM: row.OHTAM,
            OHDAM: row.OHDAM
        }));

        await connection.close();
        console.log('convertedResult : ', convertedResult.at.OHAD1);
        res.json(convertedResult);
    } catch (error) {
        console.error('Error fetching data from AS400:', error);
        res.status(500).json({ error: 'Error fetching data from AS400' });
    }
});

module.exports = router;
