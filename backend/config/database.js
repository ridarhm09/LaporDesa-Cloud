const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'lapordesa_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection().then(() => {
    console.log('✓ Database connected successfully');
}).catch(err => {
    console.error('✗ Database connection failed:', err);
});

module.exports = pool;
