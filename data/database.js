const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '',
    database: '',
    user: '',
    password: ''
});

module.exports = pool;
