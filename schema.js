// schema.js
const mysql = require('mysql2/promise');
require('dotenv').config()
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env

const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
};

const createSchema = async () => {
    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        await connection.query(`USE ${DB_NAME}`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS forms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                companyname VARCHAR(255) NOT NULL,
                phonenumber VARCHAR(20) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                isActive BOOLEAN NOT NULL,
                usercode VARCHAR(255) NOT NULL,
                nationalcode VARCHAR(20) NOT NULL,
                address TEXT NOT NULL,
                companytype VARCHAR(255) NOT NULL,
                ismarried BOOLEAN NOT NULL,
                imageUrl VARCHAR(500) NOT NULL,
                birthDate VARCHAR(255) NOT NULL,
                postalCode VARCHAR(255) NOT NULL,
                personType VARCHAR(255) NOT NULL,
                province VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // await connection.query(`
        //     CREATE TABLE IF NOT EXISTS fields (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         form_id INT,
        //         label VARCHAR(255) NOT NULL,
        //         type VARCHAR(50) NOT NULL,
        //         required BOOLEAN DEFAULT FALSE,
        //         options TEXT,
        //         FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
        //     )
        // `);

        console.log('Database schema created successfully');
    } catch (error) {
        console.error('Error creating schema:', error.message);
    } finally {
        await connection.end();
    }
};

createSchema();
