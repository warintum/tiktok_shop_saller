const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // เปลี่ยนเป็น username ของคุณ
  host: 'localhost',
  database: 'tiktok_shop_saller',
  password: 'mis2001', // เปลี่ยนเป็น password ของคุณ
  port: 5432,
});

module.exports = pool;
