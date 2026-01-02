const express = require('express');
const router = express.Router();
const { connectToAS400, convertThaiFromAS400 } = require('../services/as400Service');

// ดึงข้อมูลจาก PMONHT
router.get('/uploadview', async (req, res) => {
    let connection = null;
    try {
        connection = await connectToAS400();
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
            OHCNM: convertThaiFromAS400(row.OHCNM),
            OHTEL: row.OHTEL,
            OHAD1: convertThaiFromAS400(row.OHAD1),
            OHTAM: row.OHTAM,
            OHDAM: row.OHDAM
        }));

        res.json(convertedResult);
    } catch (error) {
        console.error('Error fetching data from AS400:', error);
        res.status(500).json({ error: 'Error fetching data from AS400' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error('Error closing AS400 connection:', closeError);
            }
        }
    }
});

module.exports = router;
