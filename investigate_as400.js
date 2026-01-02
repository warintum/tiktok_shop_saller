const { connectToAS400, convertThaiToAS400, processOHAD } = require('./services/as400Service');

async function test() {
    let conn;
    try {
        console.log('Connecting to AS400...');
        conn = await connectToAS400();
        console.log('Connected.');

        const orderId = 'TEST_FIX_' + Date.now();
        const testThai = 'ตาก'; // Standard Thai Unicode
        const convertedThai = convertThaiToAS400(testThai);

        console.log('Original Thai:', testThai);
        console.log('Manual Converted (bytes):', Buffer.from(convertedThai, 'utf16le').toString('hex'));

        // Test Query with manual conversion (current state)
        const ohad1_bad = processOHAD('**********', '', testThai);
        const ohad1_bad_converted = convertThaiToAS400(ohad1_bad);

        console.log('Testing INSERT with manual conversion (EXPECTED FAIL if this is the issue)...');
        try {
            const query = "INSERT INTO PMONHT (OHCUS, OHBIL, OHPMD, OHCNM, OHAD1, OHTDT) VALUES (?, ?, ?, ?, ?, ?)";
            await conn.query(query, [917750, 'T' + orderId.substring(0, 9), '20260102', 'TEST', ohad1_bad_converted, '20260102']);
            console.log('INSERT SUCCESS (Surprisingly?)');
        } catch (e) {
            console.error('INSERT FAILED as expected:', e.message);
            if (e.odbcErrors) console.log(JSON.stringify(e.odbcErrors, null, 2));
        }

        // Test Query without manual conversion
        console.log('\nTesting INSERT WITHOUT manual conversion (Native Unicode)...');
        try {
            const query = "INSERT INTO PMONHT (OHCUS, OHBIL, OHPMD, OHCNM, OHAD1, OHTDT) VALUES (?, ?, ?, ?, ?, ?)";
            await conn.query(query, [917750, 'U' + orderId.substring(0, 9), '20260102', 'TEST', ohad1_bad, '20260102']);
            console.log('INSERT SUCCESS WITH NATIVE UNICODE!');
        } catch (e) {
            console.error('INSERT FAILED WITH NATIVE UNICODE:', e.message);
            if (e.odbcErrors) console.log(JSON.stringify(e.odbcErrors, null, 2));
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (conn) await conn.close();
    }
}

test();
