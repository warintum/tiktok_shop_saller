const pool = require('../models/db'); // PostgreSQL connection
const moment = require('moment');
const { connectToAS400, convertThaiToAS400, processOHAD } = require('../services/as400Service');

exports.sendDataToAS400 = async (req, res) => {
  let as400Connection = null;
  try {
    // 1. Connect to AS400
    as400Connection = await connectToAS400();

    // 2. Delete existing data for customer 917750 (as per C# DeleteInAS400)
    try {
      //await as400Connection.query("DELETE FROM PMONHT WHERE OHCUS='917750'");
      //await as400Connection.query("DELETE FROM PMONLT WHERE OLCUS='917750'");
    } catch (delError) {
      console.warn('Warning deleting existing AS400 data:', delError.message);
    }

    // 3. Get Header Data from ttorder_tmp
    const headerResult = await pool.query(`
            SELECT order_id, MIN(created_time) AS created_time, buyer_username, phone_number, 
                   detail_address, district, province, zipcode, 
                   SUM(sku_subtotal_before_discount) AS sku_subtotal_before_discount, 
                   SUM(sku_seller_discount) AS sku_seller_discount 
            FROM ttorder_tmp 
            GROUP BY order_id, buyer_username, phone_number, detail_address, district, province, zipcode
        `);

    const uploadDate = moment().format('YYYYMMDD');
    let successCount = 0;
    let errorCount = 0;

    for (let row of headerResult.rows) {
      const orderId = row.order_id;

      // --- Prepare Header Data (PMONH) ---
      const ohcus = 917750;
      // Cut prefix 'TTS' (assuming 3 chars) or similar logic from C# substring(3)
      let ohbil = orderId.trim();
      if (ohbil.length > 3) ohbil = ohbil.substring(3);

      const ohpmd = moment(row.created_time).format('YYYYMMDD');

      let ohcnm = convertThaiToAS400(row.buyer_username || '');
      if (ohcnm.length > 50) ohcnm = ohcnm.substring(0, 50);

      const ohtel = ''; // C# sends empty string

      // Address Processing
      let detailAddr = row.detail_address || '';
      if (detailAddr.indexOf('*') !== -1) {
        detailAddr = detailAddr.replace(/ /g, '').trim().substring(0, 10);
      }
      let district = row.district || '';
      let province = row.province || '';

      // C# logic: if province contains 'กรุงเทพ', district = 'เขต'+district, else 'อ.'+district, 'จ.'+province
      // But the provided C# code commented this out? 
      // "/*if (province.Contains("กรุงเทพ")) ... */"
      // So we will stick to the active code which just does ConThaiAS400(district) and ConThaiAS400(province)

      // ProcessOHAD combines address parts and formats length
      let ohad1 = processOHAD(detailAddr, district, province);
      ohad1 = convertThaiToAS400(ohad1);

      let ohamp = convertThaiToAS400(district);
      let ohpov = convertThaiToAS400(province);

      let ohzip = row.zipcode || '';
      if (ohzip.indexOf('*') !== -1) ohzip = '00000';

      // Amount Calculation (C# Logic)
      // SkuSubtotalAfterDiscount = sku_subtotal_before_discount - sku_seller_discount
      const subtotalBefore = parseFloat(row.sku_subtotal_before_discount || 0);
      const sellerDiscount = parseFloat(row.sku_seller_discount || 0);
      const subtotalAfter = subtotalBefore - sellerDiscount;

      const ohtam = subtotalAfter.toFixed(2); // OHTAM = SkuSubtotalAfterDiscount
      const ohdam = sellerDiscount.toFixed(2); // OHDAM = SkuSellerDiscount
      const ohtdt = uploadDate;

      // Insert Header
      const pmonhInsertQuery = `
                INSERT INTO PMONHT (OHCUS, OHBIL, OHPMD, OHCNM, OHTEL, OHAD1, OHAMP, OHPOV, OHZIP, OHTAM, OHDAM, OHFLG, OHTDT, OHSHPC, OHTID, OHBRN, OHEMIL)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

      try {
        await as400Connection.query(pmonhInsertQuery, [
          ohcus, ohbil, ohpmd, ohcnm, ohtel, ohad1, ohamp, ohpov, ohzip, ohtam, ohdam, '', ohtdt, '', '', '', ''
        ]);

        // --- Prepare Line Items (PMONL) ---
        const lineItemsResult = await pool.query(`
                    SELECT * FROM ttorder_tmp WHERE order_id = $1
                `, [orderId]);

        let iLine = 0;
        for (let lineRow of lineItemsResult.rows) {
          iLine++;

          let sellerSku = (lineRow.seller_sku || '').replace(/ /g, '');
          let productName = lineRow.product_name || '';
          let quantity = parseFloat(lineRow.quantity || 0);

          // Parse Unit from SKU (e.g., "SKU(PK)")
          let productUMR = '';
          const openParenIndex = sellerSku.indexOf('(');
          if (openParenIndex !== -1) {
            productUMR = sellerSku.substring(openParenIndex + 1, openParenIndex + 3); // Take 2 chars? C# takes 2 chars
            sellerSku = sellerSku.substring(0, openParenIndex);
          }

          // Calculate Unit Price (OLLST)
          // C# Logic: ((skuSubtotalBeforeDiscount - sellerDiscount) / quantity)
          const lineSubtotalBefore = parseFloat(lineRow.sku_subtotal_before_discount || 0);
          const lineSellerDiscount = parseFloat(lineRow.sku_seller_discount || 0);
          const lineSubtotalAfter = lineSubtotalBefore - lineSellerDiscount;

          let unitPrice = 0;
          if (quantity !== 0) {
            unitPrice = lineSubtotalAfter / quantity;
          }

          const olitm = sellerSku;
          const oldes = convertThaiToAS400(productName).substring(0, 30);
          const olumr = productUMR;
          const olqty = quantity;
          const ollst = unitPrice.toFixed(2);
          const olamt = lineSubtotalAfter.toFixed(2);

          const pmonlInsertQuery = `
                        INSERT INTO PMONLT (OLCUS, OLBIL, OLPMD, OLLIN, OLITM, OLDES, OLUMR, OLQTY, OLLST, OLAMT, OLTDT)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

          await as400Connection.query(pmonlInsertQuery, [
            ohcus, ohbil, ohpmd, iLine, olitm, oldes, olumr, olqty, ollst, olamt, ohtdt
          ]);
        }

        successCount++;

        // --- Move Data to ttorder (PostgreSQL) ---
        // 1. Delete from ttorder if exists
        await pool.query('DELETE FROM ttorder WHERE order_id = $1', [orderId]);

        // 2. Insert into ttorder
        await pool.query(`
                    INSERT INTO ttorder (
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
                    )
                    SELECT 
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
                        package_id, seller_note, checked_status, checked_marked_by, $2, $3
                    FROM ttorder_tmp 
                    WHERE order_id = $1
                `, [orderId, moment().toDate(), 'Y']);

      } catch (orderError) {
        console.error('Error processing order ' + orderId + ':', orderError);
        errorCount++;
      }
    }

    // 4. Cleanup ttorder_tmp
    if (successCount > 0) {
      await pool.query('DELETE FROM ttorder_tmp');
    }

    res.send(`Data processing completed. Success: ${successCount}, Errors: ${errorCount}`);

  } catch (error) {
    console.error('Error sending data to AS400:', error.message);
    res.status(500).send(`Error sending data to AS400: ${error.message}`);
  } finally {
    if (as400Connection) {
      try {
        await as400Connection.close();
      } catch (closeError) {
        console.error('Error closing AS400 connection:', closeError);
      }
    }
  }
};