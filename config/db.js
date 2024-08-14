// config/db.js
const mysql = require('mysql2/promise');

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'TARAZ',
            port: 3307,
            password: 'PASSWORD',
            database: 'TARAZ_FORM_BUILDER'
        });
        console.log('MySQL Connected');
        return connection;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
