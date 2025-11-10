const odbc = require('odbc');
const pool = require('../models/db'); // การเชื่อมต่อ PostgreSQL
const moment = require('moment');
const convertThaiToEBCDIC = require('./thaiToEBCDIC');
const convertthaiToAs400 = require('./thaiToAs400')
//const iconv = require('iconv-lite');
//const EBCDIC = require("ebcdic-ascii").default


// ฟังก์ชันสำหรับส่งข้อมูลจาก ttorder_tmp ไปยัง PMONH
exports.sendDataToAS400 = async (req, res) => {
    try {
      // เชื่อมต่อไปยัง AS400 ผ่าน ODBC
      //const as400Connection = await odbc.connect('Dsn=TESTF;uid=ssa;pwd=ssa;Encoding=UTF8');
      const as400Connection = await odbc.connect('Dsn=LIBBPCSCDF;uid=ssa;pwd=ssa');

      //const converter = new EBCDIC("0037")
  
      // ดึงข้อมูลจากตาราง ttorder_tmp
      const result = await pool.query(`
        SELECT order_id, MIN(created_time) AS created_time, buyer_username, phone_number, 
               detail_address, district, province, zipcode, SUM(sku_subtotal_before_discount) AS sku_subtotal_before_discount, 
               SUM(sku_seller_discount) AS sku_seller_discount 
        FROM ttorder_tmp 
        GROUP BY order_id, buyer_username, phone_number, detail_address, district, province, zipcode
      `);
  
      const uploadDate = moment().format('YYYYMMDD'); // รูปแบบวันที่ yyyyMMdd
  
      for (let row of result.rows) {
        const ohcus = 988898;
        const ohbil = row.order_id.substring(0, 15);
        const ohpmd = moment(row.created_time).format('YYYYMMDD');
        const ohcnm = row.buyer_username;
        const ohtel = row.phone_number.substring(0, 15);
        //const ohad1 = iconv.encode('BCDEFGHRSTUVWXbcdefghrstuvwx ชซฌญฎฏฐฑฒณดตถทธนบ', 'windows-874'); // ฎ = อ  กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผษสหฬอฮ๐๑๒๓๔๕๖๗๘๙ฯ
        //const ohad1 = iconv.encode('ฎปฎผฎฝฎพฎฟฎหฎฬฎอฎฮฎฯ', 'windows-874');  // อะอัอาอำอิอีอึอือุอู
        //const ohad1 = iconv.encode('ฎ์ ฎํ ฎ๎ ฎ๏ ฎ๚ ฎ๛', 'windows-874'); // อ็อ่อ้อ๊อ๋อ์
        //const ohad1 = iconv.encode('ฎ฿ฎ๊ฎ์', 'windows-874');  // อไอๅอ็
        //const ohad1 = iconv.encode('กขฃคฅฆงจฉ', 'windows-874'); // ฎ = อ
        //const ohad1 = convertthaiToAs400('BCDEFGHRSTUVWXbcdefghrstuvwx');
        const ohad1 = convertthaiToAs400('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ');
        //const ohad1 = convertthaiToAs400('กขฃคฅฆง');
        //const ohad1 = iconv.encode('ÀÁÂÃÄÅÆ', 'windows-874');
        //const ohad1 = converter.toASCII('505152535455565758595A5B5C5D5E5F'); // Test Message
        const ohamp = row.district;
        const ohpov = row.province;
        const ohzip = ''; //row.zipcode
        const ohtam = row.sku_subtotal_before_discount;
        const ohdam = row.sku_seller_discount;
        const ohtdt = uploadDate;

        //console.log('ohad1: ',ohad1);
        //console.log('ohad1 hex: ', ohad1.toString('hex')); // ดูค่าในรูปแบบ hexadecimal
        
        // Buffer ที่ประกอบด้วย bytes
        //const buffer = Buffer.from(ohad1.toString('hex'), 'hex');

        // แปลง buffer กลับเป็นข้อความภาษาไทย
        //const decodedText = iconv.decode(buffer, 'windows-874');

        // แสดงผลลัพธ์
        //console.log('decodedText: ',decodedText);
  
        // แทรกข้อมูลลงใน PMONH บน AS400
        const pmonhInsertQuery = `
          INSERT INTO PMONH (OHCUS, OHBIL, OHPMD, OHCNM, OHTEL, OHAD1, OHAMP, OHPOV, OHZIP, OHTAM, OHDAM, OHFLG, OHTDT, OHTID, OHBRN, OHEMIL)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
  
        try {
          await as400Connection.query(pmonhInsertQuery, [
            ohcus, ohbil, ohpmd, ohcnm, ohtel, ohad1, ohamp, ohpov, ohzip, ohtam, ohdam, '', ohtdt, '', '', ''
          ]);
        } catch (sqlError) {
          console.error('SQL Error:', sqlError);
          res.status(500).send(`SQL Error: ${sqlError.message}`);
          return;
        }
      }
  
      // ปิดการเชื่อมต่อกับ AS400
      await as400Connection.close();
  
      res.send('Data successfully sent to AS400.');
    } catch (error) {
      console.error('Error sending data to AS400:', error.message);
      res.status(500).send(`Error sending data to AS400: ${error.message}`);
    }
  };
  