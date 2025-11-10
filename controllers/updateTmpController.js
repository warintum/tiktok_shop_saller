const pool = require('../models/db'); // นำเข้าการเชื่อมต่อฐานข้อมูล

exports.updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { updates, selectedId } = req.body;
    console.log('updates req.body ==== : ',req.body);
    console.log('updates req.params ==== : ',req.params);

    try {
        // อัปเดตฟิลด์ buyer_username, province, zipcode
        if (updates.buyer_username || updates.province || updates.zipcode || updates.detail_address) {
            await pool.query(`
                UPDATE ttorder_tmp SET 
                buyer_username = COALESCE($1, buyer_username), 
                province = COALESCE($2, province), 
                zipcode = COALESCE($3, zipcode), 
                detail_address = COALESCE($4, detail_address)
                WHERE order_id = $5
            `, [updates.buyer_username, updates.province, updates.zipcode, updates.detail_address, orderId]);
        }

        // อัปเดตฟิลด์ seller_sku, product_name, quantity, sku_unit_original_price, sku_seller_discount, sku_subtotal_after_discount
        if (updates.seller_sku || updates.product_name || updates.quantity || updates.sku_unit_original_price || updates.sku_seller_discount || updates.sku_subtotal_after_discount) {
            await pool.query(`
                UPDATE ttorder_tmp SET 
                seller_sku = COALESCE($1, seller_sku), 
                product_name = COALESCE($2, product_name), 
                quantity = COALESCE($3, quantity), 
                sku_unit_original_price = COALESCE($4, sku_unit_original_price),
                sku_seller_discount = COALESCE($5, sku_seller_discount),
                sku_subtotal_after_discount = COALESCE($6, sku_subtotal_after_discount)
                WHERE order_id = $7 AND sku_id = $8
            `, [updates.seller_sku, updates.product_name, updates.quantity, updates.sku_unit_original_price, updates.sku_seller_discount, updates.sku_subtotal_after_discount, orderId, selectedId]);
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating order' });
    }
};
