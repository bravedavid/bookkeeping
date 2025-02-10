// db.js
const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '.My1YsIQLLfNK',
  database: 'bookkeeping',
});

module.exports = pool.promise(); // 使用 promise 版本的连接池

