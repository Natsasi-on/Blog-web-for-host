const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'buiwarp0roi2pe7kywvn-mysql.services.clever-cloud.com',
    database: 'buiwarp0roi2pe7kywvn',
    user: 'uaj0ljkkrp0ymah5',
    password: 'mSNRRbvOz84R4UbnwF4D'
});

module.exports = pool;
