// config/database.js
const mysql = require('mysql2');
require('dotenv').config();

console.log('📊 Database Config:');
console.log('  Host:', process.env.DB_HOST || 'localhost');
console.log('  User:', process.env.DB_USER || 'root');
console.log('  Database:', process.env.DB_NAME || 'perpustakaan');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'perpustakaan',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection dengan promise
const testConnection = async () => {
    try {
        const connection = await pool.promise().getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('💡 Pastikan:');
        console.error('   1. XAMPP/MySQL sedang berjalan');
        console.error('   2. Database "perpustakaan" sudah dibuat');
        console.error('   3. Konfigurasi di .env sudah benar');
        return false;
    }
};

// Test immediately
testConnection();

module.exports = pool.promise();