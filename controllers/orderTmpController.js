const pool = require('../models/db');

exports.getOrders = async (req, res) => {
  const { startDate, endDate, sortBy, page } = req.query;

  const offset = (page - 1) * 50;
  const sortFields = {
    'Upload Date': 'uploaddate',
    'Created Time': 'created_time',
    'Paid Time': 'paid_time',
    'Shipped Time': 'shipped_time',
    'Delivered Time': 'delivered_time',
  };

  console.log('req.query : ', req.query);

  const sortField = sortFields[sortBy] || 'created_time';

  console.log('sortField : ', sortField);

  try {
    const ordersQuery = `
      SELECT 
        created_time, buyer_username, order_id, order_status, sku_id, seller_sku, 
        product_name, quantity, sku_unit_original_price, sku_seller_discount, 
        sku_subtotal_after_discount, shipping_provider_name, payment_method, detail_address, province, zipcode,
        paid_time, rts_time, shipped_time, delivered_time, uploaddate, getflg 
      FROM ttorder_tmp
      WHERE ${sortField} BETWEEN $1 AND $2
      ORDER BY ${sortField} ASC
      LIMIT 50 OFFSET $3;
    `;

    const orders = await pool.query(ordersQuery, [startDate, endDate, offset]);

    console.log('orders : ', orders);

    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
