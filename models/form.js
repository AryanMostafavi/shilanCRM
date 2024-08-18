const mysql = require('mysql2/promise');
const fs = require('fs');
const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = require('../config/db');
require('dotenv').config();
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const moment = require('moment');
Adler32 = require('adler32-js');
const sms = require('../services/SMSService');


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
        let hash = new Adler32();
        hash.update(formData.phonenumber);
        let userCode =   hash.digest('hex')
        const {
            firstname = null,
            lastname = null,
            phonenumber = null,
            email = null,
            address = null,
            nationalcode = null,
            birthdate = null,
            postalcode = null,
            persontype = null,
            imageurl = null,
            cartnumber = null,
            approved = false,
            province,
            city,
            isactive = false,
            usercode = userCode,
        } = formData;
        // const ismarried = maritalstatus === 'مجرد' ? false : true;
        const [result] = await connection.execute(
            'INSERT INTO forms (firstname, lastname, phonenumber, email, address, nationalcode, birthdate, postalcode, persontype, imageurl,province,city,isactive ,usercode ,cartnumber, approved) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)',
            [firstname, lastname, phonenumber, email, address, nationalcode, birthdate, postalcode,  persontype, imageurl, province, city, isactive, usercode,cartnumber, approved]
        );

        const sendSMS  = await sms.sendSMS(phonenumber,usercode )
        return {
            firstname,
            lastname,
            phonenumber,
            email,
            address,
            nationalcode,
            birthdate,
            postalcode,
            persontype,
            province,
            city,
            imageurl,
            usercode,
            isactive,
            cartnumber,
            approved,
            fields: formData.fields || []
        };


    } catch (error) {
        console.error("Error creating form:", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

exports.getForms = async () => {
    const connection = await connectDB();
    const [forms] = await connection.execute('SELECT * FROM forms where deleted_at IS NULL ORDER BY id DESC');
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
        firstname, lastname, phonenumber, email, address, nationalcode, birthdate,
        postalcode, persontype, imageurl, province, city, isactive, usercode,cartnumber
    } = formData;

    const personTypeValues = Array.isArray(persontype) ? persontype : [];


    const processedPersonType = personTypeValues.map(value => {
        const numberValue = Number(value);
        return isNaN(numberValue) ? value : numberValue;
    });

    const [[existingForm]]  = await connection.execute('SELECT * FROM forms WHERE id = ?', [formId]);
    if (formData.imageurl) {
        const oldImageUrl = existingForm.imageurl.replace('static', '');
        const oldFilePath = path.join(__dirname,'../public', path.basename(oldImageUrl));

        try {
            await unlinkAsync(oldFilePath);
        } catch (error) {
            console.error('Failed to delete old file:', error);
        }
    }


    const oldImageUrl = existingForm.imageurl ? existingForm.imageurl.replace('static/', 'public/') : null;

    let updateFields = [];
    let values = [];

    if (formData.firstname !== undefined) {
        updateFields.push('firstname = ?');
        values.push(formData.firstname);
    }
    if (formData.lastname !== undefined) {
        updateFields.push('lastname = ?');
        values.push(formData.lastname);
    }
    if (formData.cartnumber !== undefined) {
        updateFields.push('cartnumber = ?');
        values.push(formData.cartnumber);
    }
    if (formData.phonenumber !== undefined) {
        updateFields.push('phonenumber = ?');
        values.push(formData.phonenumber);
    }
    if (formData.email !== undefined) {
        updateFields.push('email = ?');
        values.push(formData.email);
    }
    if (formData.address !== undefined) {
        updateFields.push('address = ?');
        values.push(formData.address);
    }
    if (formData.nationalcode !== undefined) {
        updateFields.push('nationalcode = ?');
        values.push(formData.nationalcode);
    }
    if (formData.birthdate !== undefined) {
        updateFields.push('birthdate = ?');
        values.push(formData.birthdate);
    }
    if (formData.postalcode !== undefined) {
        updateFields.push('postalcode = ?');
        values.push(formData.postalcode);
    }
    if (processedPersonType.length > 0) {
        updateFields.push('persontype = ?');
        values.push(processedPersonType);
    }
    if (formData.imageurl !== null) {
        updateFields.push('imageurl = ?');
        values.push(formData.imageurl);
    }
    if (formData.province !== undefined) {
        updateFields.push('province = ?');
        values.push(formData.province);
    }
    if (formData.city !== undefined) {
        updateFields.push('city = ?');
        values.push(formData.city);
    }
    if (formData.isactive !== undefined) {
        updateFields.push('isactive = ?');
        values.push(formData.isactive);
    }
    if (formData.usercode !== undefined) {
        updateFields.push('usercode = ?');
        values.push(formData.usercode);
    }

    if (updateFields.length === 0) {
        throw new Error('No fields to update');
    }

    values.push(formId);

    const updateQuery = `UPDATE forms SET ${updateFields.join(', ')} WHERE id = ?`;

    try {
        await connection.execute(updateQuery, values);
    } catch (error) {
        console.error('Error executing update:', error);
        throw error;
    }

    if (oldImageUrl && formData.imageurl && oldImageUrl !== formData.imageurl) {
        const oldFilePath = path.join(__dirname, '../public', path.basename(oldImageUrl));

        try {
            if (fs.existsSync(oldFilePath)) {
                await unlinkAsync(oldFilePath);
            }
        } catch (error) {
            console.error('Failed to delete old file:', error);
        }
    }

    return {
        id: formId,
        ...formData,
        persontype: processedPersonType
    };
};


exports.deleteForms = async (formId) => {
    const connection = await connectDB();
    const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const result = await connection.execute('UPDATE forms set deleted_at = ? where id= ?', [deletedAt, formId]);
    return result
};


exports.changeActiveType = async (formId, type) => {

    if (formId === undefined || type === undefined) {
        throw new Error("formId and type must be defined");
    }
    if (typeof type != "number") type = number(type);

    const connection = await connectDB();
    const result = await connection.execute('UPDATE forms SET isactive = ? WHERE id = ?', [type, formId]);
    return result;
};

exports.changeApprovedType = async (formId, type) => {

    if (formId === undefined || type === undefined) {
        throw new Error("formId and type must be defined");
    }
    if (typeof type != "number") type = number(type);

    const connection = await connectDB();
    const result = await connection.execute('UPDATE forms SET approved = ? WHERE id = ?', [type, formId]);
    return result;
};