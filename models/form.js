const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config/db');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;


const dbConfig = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: 3306,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
};

const connectDB = async () => {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
};

const pool = mysql.createPool(dbConfig);

exports.createForm = async (formData) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const {
            firstName = null,
            lastName = null,
            phoneNumber = null,
            email = null,
            address = null,
            nationalCode = null,
            birthDate = null,
            postalCode = null,
            maritalStatus = null,
            personType = null,
            imageUrl,
            province,
            city,
            isActive,
        } = formData;
        const isMarried = maritalStatus === 'مجرد' ? false : true;

        const [result] = await connection.execute(
            'INSERT INTO forms (firstName, lastName, phoneNumber, email, address, nationalCode, birthDate, postalCode, isMarried, personType, imageUrl,province,city,isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)',
            [firstName, lastName, phoneNumber, email, address, nationalCode, birthDate, postalCode, isMarried, personType, imageUrl,province,city , isActive]
        );

        // const formId = result.insertId;
        //
        // if (formData.fields) {
        //     for (const field of formData.fields) {
        //         const { label, type, required = false, options = null } = field;
        //         await connection.execute(
        //             'INSERT INTO fields (form_id, label, type, required, options) VALUES (?, ?, ?, ?, ?)',
        //             [formId, label, type, required, JSON.stringify(options)]
        //         );
        //     }
        // }

        // return {
        //     id: formId, firstName, lastName, phoneNumber, email, address,
        //     nationalCode, birthDate, postalCode, isMarried, personType,province,city, imageUrl,fields: formData.fields || []
        // };
    } catch (error) {
        console.error("Error creating form:", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

exports.getForms = async () => {
    const connection = await connectDB();
    const [forms] = await connection.execute('SELECT * FROM forms');
    return forms;
};

exports.getFormById = async (formId) => {
    const connection = await connectDB();
    const [[form]] = await connection.execute('SELECT * FROM forms WHERE id = ?', [formId]);
    if (!form) return null;

    const [fields] = await connection.execute('SELECT * FROM fields WHERE form_id = ?', [formId]);
    form.fields = fields;
    return form;
};

exports.updateForm = async (formId, formData) => {
    const connection = await connectDB();
    const {
        firstName, lastName, phoneNumber, email, address, nationalCode, birthDate,
        postalCode, isMarried, personType, imageUrl,province,city,isActive
    } = formData;

    await connection.execute(
        'UPDATE forms SET name = ?, firstName = ?, lastName = ?, phoneNumber = ?,postalCode=?, email = ?, nationalCode = ?, address = ?, birthDate = ?, isMarried = ?, personType = ? WHERE id = ?',
        [ firstName, lastName, phoneNumber, email, nationalCode, address, postalCode, birthDate, isMarried, personType, formId,imageUrl,province,city,isActive]
    );

    await connection.execute('DELETE FROM fields WHERE form_id = ?', [formId]);

    for (const field of fields) {
        const { label, type, required, options } = field;
        await connection.execute(
            'INSERT INTO fields (form_id, label, type, required, options) VALUES (?, ?, ?, ?, ?)',
            [formId, label, type, required, JSON.stringify(options)]
        );
    }

    return {
        id: formId,  firstName, lastName, phoneNumber, email,
        nationalCode, address, birthDate, isMarried, personType, fields,postalCode , imageUrl,province,city,isActive
    };
};


exports.deleteForms = async (formId) => {
    const connection = await connectDB();
    const result = await connection.execute('DELETE from forms where id= ?' ,[formId]);
    return result
};