const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx'); // เพิ่มเพื่อใช้งานกับไฟล์ Excel
const pool = require('../models/db');
const moment = require('moment');
const path = require('path');

exports.uploadCSV = async (req, res) => {
    const filePath = req.file.path;
    const clearData = req.body.clearData === 'true'; // รับค่าจาก body
    const uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const originalFileName = req.file.originalname; // ดึงชื่อไฟล์ต้นฉบับที่อัพโหลด
    const fileExtension = path.extname(originalFileName).toLowerCase(); // ดึงนามสกุลจากชื่อไฟล์ต้นฉบับ

    console.log('fileExtension:', fileExtension);

    const expectedHeaders = [
        'Order ID', 'Order Status', 'Order Substatus', 'Cancelation/Return Type', 'Normal or Pre-order',
        'SKU ID', 'Seller SKU', 'Product Name', 'Variation', 'Quantity', 'Sku Quantity of return',
        'SKU Unit Original Price', 'SKU Subtotal Before Discount', 'SKU Platform Discount',
        'SKU Seller Discount', 'SKU Subtotal After Discount', 'Shipping Fee After Discount',
        'Original Shipping Fee', 'Shipping Fee Seller Discount', 'Shipping Fee Platform Discount',
        'Taxes', 'Small Order Fee', 'Order Amount', 'Order Refund Amount', 'Created Time', 'Paid Time',
        'RTS Time', 'Shipped Time', 'Delivered Time', 'Cancelled Time', 'Cancel By', 'Cancel Reason',
        'Fulfillment Type', 'Warehouse Name', 'Tracking ID', 'Delivery Option', 'Shipping Provider Name',
        'Buyer Message', 'Buyer Username', 'Recipient', 'Phone #', 'Zipcode', 'Country', 'Province',
        'District', 'Detail Address', 'Additional address information', 'Payment Method', 'Weight(kg)',
        'Product Category', 'Package ID', 'Seller Note', 'Checked Status', 'Checked Marked by'
    ];

    const results = [];
    let headersVerified = false;

    // ถ้าผู้ใช้เลือก clearData ให้ลบข้อมูลในตารางก่อน
    if (clearData) {
        try {
            await pool.query('DELETE FROM ttorder_tmp'); // ลบข้อมูลในตาราง ttorder_tmp
            console.log('ลบข้อมูลในตาราง ttorder_tmp สำเร็จ');
        } catch (error) {
            console.error('ไม่สามารถลบข้อมูลในตาราง ttorder_tmp:', error.message);
            return res.status(500).send('Server Error: ลบข้อมูลไม่สำเร็จ');
        }
    }

    if (fileExtension === '.csv') {
        // สำหรับไฟล์ CSV
        try {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('headers', (headers) => {
                    headers[0] = headers[0].replace(/^\uFEFF/, ''); // ลบ BOM
                    headersVerified = expectedHeaders.every((header, index) => header === headers[index]);
                    if (!headersVerified) {
                        // ใช้ res.status แทนการโยน error
                        fs.unlinkSync(filePath); // ลบไฟล์ CSV ที่อัปโหลดหาก headers ไม่ตรงกัน
                        return res.status(400).send('Headers ในไฟล์ CSV ไม่ตรงกับรูปแบบ');
                    }
                })
                .on('data', (data) => {
                  if (headersVerified) {
                      processRow(data);
                  }
                })
                .on('end', async () => {
                  if (headersVerified) {
                    handleInsertData(res, results, filePath, uploadDate);
                  }
                }) 
                .on('error', (error) => {
                    console.error(`Error processing CSV: ${error.message}`);
                    fs.unlinkSync(filePath); // ลบไฟล์ที่อัปโหลดหากเกิดข้อผิดพลาด
                    return res.status(400).send(`Error processing CSV file: ${error.message}`);
                });
        } catch (error) {
            console.error('Error processing CSV:', error.message);
            fs.unlinkSync(filePath); // ลบไฟล์ CSV ที่อัปโหลดหากเกิดข้อผิดพลาด
            return res.status(400).send(`Error processing CSV file: ${error.message}`);
        }
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        // สำหรับไฟล์ Excel
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '', header: 1 });

            const headers = jsonData[0];
            console.log('headers:', headers);

            headersVerified = expectedHeaders.every((header, index) => header === headers[index]);

            if (!headersVerified) {
                fs.unlinkSync(filePath);
                return res.status(400).send('Headers ในไฟล์ Excel ไม่ตรงกับรูปแบบ');
            }

            jsonData.slice(2).forEach((row) => {
                const data = {};
                headers.forEach((header, index) => {
                    data[header] = row[index];
                });
                processRow(data);
            });
            handleInsertData(res, results, filePath, uploadDate);
        } catch (error) {
            console.error('Error processing Excel file:', error.message);
            fs.unlinkSync(filePath);
            return res.status(400).send(`Error processing Excel file: ${error.message}`);
        }
    } else {
        fs.unlinkSync(filePath);
        return res.status(400).send('รูปแบบไฟล์ที่ไม่รองรับ');
    }

    // ฟังก์ชันประมวลผลข้อมูลในแต่ละแถว
    function processRow(data) {

        if (!headersVerified) {
            return; // ป้องกันการประมวลผลถ้า headers ไม่ถูกต้อง
        }
        // ลบ 'THB' ออกจากค่าที่ควรเป็นตัวเลข
        data['SKU Unit Original Price'] = parseFloat(data['SKU Unit Original Price'].replace('THB', '').trim());
        data['SKU Subtotal Before Discount'] = parseFloat(data['SKU Subtotal Before Discount'].replace('THB', '').trim());
        data['SKU Platform Discount'] = parseFloat(data['SKU Platform Discount'].replace('THB', '').trim());
        data['SKU Seller Discount'] = parseFloat(data['SKU Seller Discount'].replace('THB', '').trim());
        data['SKU Subtotal After Discount'] = parseFloat(data['SKU Subtotal After Discount'].replace('THB', '').trim());
        data['Shipping Fee After Discount'] = parseFloat(data['Shipping Fee After Discount'].replace('THB', '').trim());
        data['Original Shipping Fee'] = parseFloat(data['Original Shipping Fee'].replace('THB', '').trim());
        data['Shipping Fee Seller Discount'] = parseFloat(data['Shipping Fee Seller Discount'].replace('THB', '').trim());
        data['Shipping Fee Platform Discount'] = parseFloat(data['Shipping Fee Platform Discount'].replace('THB', '').trim());
        data['Taxes'] = parseFloat(data['Taxes'].replace('THB', '').trim());
        data['Small Order Fee'] = parseFloat(data['Small Order Fee'].replace('THB', '').trim());
        data['Order Amount'] = parseFloat(data['Order Amount'].replace('THB', '').trim());
        data['Order Refund Amount'] = parseFloat(data['Order Refund Amount'].replace('THB', '').trim());

        // ตรวจสอบและแปลงค่า timestamp ให้เป็น null ถ้าเป็นช่องว่าง
        /*data['Created Time'] = data['Created Time'].trim() === '' ? null : data['Created Time'];
        data['Paid Time'] = data['Paid Time'].trim() === '' ? null : data['Paid Time'];
        data['RTS Time'] = data['RTS Time'].trim() === '' ? null : data['RTS Time'];
        data['Shipped Time'] = data['Shipped Time'].trim() === '' ? null : data['Shipped Time'];
        data['Delivered Time'] = data['Delivered Time'].trim() === '' ? null : data['Delivered Time'];
        data['Cancelled Time'] = data['Cancelled Time'].trim() === '' ? null : data['Cancelled Time'];*/
        // ตรวจสอบและแปลงค่า timestamp
        data['Created Time'] = validateAndFormatDate(data['Created Time']);
        data['Paid Time'] = validateAndFormatDate(data['Paid Time']);
        data['RTS Time'] = validateAndFormatDate(data['RTS Time']);
        data['Shipped Time'] = validateAndFormatDate(data['Shipped Time']);
        data['Delivered Time'] = validateAndFormatDate(data['Delivered Time']);
        data['Cancelled Time'] = validateAndFormatDate(data['Cancelled Time']);

        data['Small Order Fee'] = data['Small Order Fee'] == null || isNaN(data['Small Order Fee']) ? 0 : data['Small Order Fee'];
        data['Order Refund Amount'] = data['Order Refund Amount'] == null || isNaN(data['Order Refund Amount']) ? 0 : data['Order Refund Amount'];

        results.push(data);
    }

    // ฟังก์ชันสำหรับตรวจสอบและแปลงวันที่
    function validateAndFormatDate(dateString) {
        if (dateString && dateString.trim() !== '') {
            // ตรวจสอบว่ารูปแบบวันที่ถูกต้องหรือไม่
            if (moment(dateString, 'DD/MM/YYYY HH:mm:ss', true).isValid()) {
                return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            }
        }
        return null; // คืนค่า null หากวันที่ว่างเปล่าหรือรูปแบบไม่ถูกต้อง
    }

    // ฟังก์ชันจัดการการอัปเดตฐานข้อมูล
    async function handleInsertData(res, results, filePath, uploadDate) {
        if (headersVerified) {
            try {
                for (let row of results) {
                    row.uploaddate = uploadDate;
                    row.getflg = '';

                    const columns = `
                        order_id, order_status, order_substatus, cancelation_return_type, 
                        normal_or_preorder, sku_id, seller_sku, product_name, variation, quantity, 
                        sku_quantity_of_return, sku_unit_original_price, sku_subtotal_before_discount, 
                        sku_platform_discount, sku_seller_discount, sku_subtotal_after_discount, 
                        shipping_fee_after_discount, original_shipping_fee, 
                        shipping_fee_seller_discount, shipping_fee_platform_discount, taxes, 
                        small_order_fee, order_amount, order_refund_amount, created_time, paid_time, 
                        rts_time, shipped_time, delivered_time, cancelled_time, cancel_by, cancel_reason, 
                        fulfillment_type, warehouse_name, tracking_id, delivery_option, 
                        shipping_provider_name, buyer_message, buyer_username, recipient, 
                        phone_number, zipcode, country, province, district, detail_address, 
                        additional_address_information, payment_method, weight_kg, product_category, 
                        package_id, seller_note, checked_status, checked_marked_by, uploaddate, getflg
                    `;

                    const values = [
                        row['Order ID'],
                        row['Order Status'],
                        row['Order Substatus'],
                        row['Cancelation/Return Type'],
                        row['Normal or Pre-order'],
                        row['SKU ID'],
                        row['Seller SKU'],
                        row['Product Name'],
                        row['Variation'],
                        row['Quantity'],
                        row['Sku Quantity of return'],
                        row['SKU Unit Original Price'],
                        row['SKU Subtotal Before Discount'],
                        row['SKU Platform Discount'],
                        row['SKU Seller Discount'],
                        row['SKU Subtotal After Discount'],
                        row['Shipping Fee After Discount'],
                        row['Original Shipping Fee'],
                        row['Shipping Fee Seller Discount'],
                        row['Shipping Fee Platform Discount'],
                        row['Taxes'],
                        row['Small Order Fee'],
                        row['Order Amount'],
                        row['Order Refund Amount'],
                        row['Created Time'],
                        row['Paid Time'],
                        row['RTS Time'],
                        row['Shipped Time'],
                        row['Delivered Time'],
                        row['Cancelled Time'],
                        row['Cancel By'],
                        row['Cancel Reason'],
                        row['Fulfillment Type'],
                        row['Warehouse Name'],
                        row['Tracking ID'],
                        row['Delivery Option'],
                        row['Shipping Provider Name'],
                        row['Buyer Message'],
                        row['Buyer Username'],
                        row['Recipient'],
                        row['Phone #'],
                        row['Zipcode'],
                        row['Country'],
                        row['Province'],
                        row['District'],
                        row['Detail Address'],
                        row['Additional address information'],
                        row['Payment Method'],
                        parseFloat(row['Weight(kg)']),
                        row['Product Category'],
                        row['Package ID'],
                        row['Seller Note'],
                        row['Checked Status'],
                        row['Checked Marked by'],
                        row.uploaddate,
                        row.getflg,
                    ];

                    const queryText = `
                        INSERT INTO ${row['Order Status'] === 'Canceled' ? 'ttcancel' : 'ttorder_tmp'} (${columns})
                        VALUES(${values.map((_, i) => `$${i + 1}`).join(', ')})
                    `;

                    await pool.query(queryText, values);
                }

                fs.unlinkSync(filePath);
                res.send('อัปโหลดไฟล์และเพิ่มข้อมูลเรียบร้อยแล้ว');
            } catch (error) {
                console.error('Error inserting data:', error.message);
                fs.unlinkSync(filePath);
                res.status(500).send('ข้อผิดพลาดของเซิร์ฟเวอร์: ล้มเหลวในการเพิ่มข้อมูล');
            }
        } else {
            fs.unlinkSync(filePath);
            res.status(400).send('Headers ไม่ตรงกับรูปแบบที่คาดไว้');
        }
    }
};
