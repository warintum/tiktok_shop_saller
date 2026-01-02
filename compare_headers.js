const xlsx = require('xlsx');
const path = require('path');

const file1 = 'c:/nodeapp/tiktok_shop_saller/docs/ที่จะจัดส่ง คำสั่งซื้อ-2025-11-19-10_26.xlsx';
const file2 = 'c:/nodeapp/tiktok_shop_saller/docs/ที่จะจัดส่ง คำสั่งซื้อ-2026-01-02-10_17.xlsx';

function getHeaders(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    return jsonData[0];
}

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

const headers1 = getHeaders(file1);
const headers2 = getHeaders(file2);

console.log('File 1 Headers Count:', headers1.length);
console.log('File 2 Headers Count:', headers2.length);
console.log('Expected Headers Count:', expectedHeaders.length);

console.log('\n--- Side-by-Side Comparison ---');
const maxLen = Math.max(headers1.length, headers2.length, expectedHeaders.length);
console.log('Index | Expected | File 1 (Success) | File 2 (Fail)');
console.log('------|----------|------------------|--------------');
for (let i = 0; i < maxLen; i++) {
    const exp = expectedHeaders[i] || '---';
    const h1 = headers1[i] || '---';
    const h2 = headers2[i] || '---';
    const marker = (exp !== h2) ? '>>' : '  ';
    console.log(`${marker} ${i.toString().padEnd(3)} | ${exp.padEnd(30)} | ${h1.padEnd(30)} | ${h2}`);
}

