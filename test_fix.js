const fs = require('fs');
const xlsx = require('xlsx');
const moment = require('moment');

// Mock request and response
const req = {
    file: {
        path: 'c:/nodeapp/tiktok_shop_saller/docs/ที่จะจัดส่ง คำสั่งซื้อ-2026-01-02-10_17.xlsx',
        originalname: 'ที่จะจัดส่ง คำสั่งซื้อ-2026-01-02-10_17.xlsx'
    },
    body: {
        clearData: 'false'
    }
};

const res = {
    status: (code) => ({
        send: (msg) => console.log(`Status ${code}: ${msg}`)
    }),
    send: (msg) => console.log(`Success: ${msg}`)
};

// Simulation of the logic in uploadController.js
const requiredHeaders = [
    'Order ID', 'Order Status', 'Seller SKU', 'Product Name', 'Quantity', 'Order Amount'
];

async function testUpload() {
    console.log('Testing upload with file:', req.file.path);
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '', header: 1 });

    const headers = jsonData[0];
    console.log('Headers found:', headers.length);

    const headersVerified = requiredHeaders.every(header => headers.includes(header));
    console.log('Headers Verified:', headersVerified);

    if (!headersVerified) {
        console.error('FAIL: Headers verification failed');
        return;
    }

    const cleanPrice = (val) => {
        if (val === undefined || val === null || val === '') return 0;
        if (typeof val === 'string') {
            return parseFloat(val.replace('THB', '').replace(/,/g, '').trim()) || 0;
        }
        return parseFloat(val) || 0;
    };

    const firstRowData = {};
    const row = jsonData[2]; // Data start at index 2 (slice(2))
    headers.forEach((header, index) => {
        firstRowData[header] = row[index];
    });

    console.log('\nSample Processing (First Row):');
    console.log('Order ID:', firstRowData['Order ID']);
    console.log('Order Amount (Original):', firstRowData['Order Amount']);
    console.log('Order Amount (Cleaned):', cleanPrice(firstRowData['Order Amount']));

    console.log('\nNew Column Check:');
    console.log('Payment platform discount:', firstRowData['Payment platform discount']);
    console.log('Payment platform discount (Cleaned):', cleanPrice(firstRowData['Payment platform discount']));

    console.log('\nSUCCESS: Logic verification completed.');
}

testUpload();
