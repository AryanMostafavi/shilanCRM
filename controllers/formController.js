const Form = require('../models/form');
const sms = require('../services/SMSService');

exports.createForm = async (req, res) => {
    try {
        if (req.file) {
            const imageUrl = `/static/${req.file.filename ?? null}`;
            req.body.imageurl = imageUrl;
        } else req.body.imageurl = null;

        const form = await Form.createForm(req.body);
        res.status(201).json(form);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getForms = async (req, res) => {
    try {
        const forms = await Form.getForms();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFormById = async (req, res) => {
    try {
        const form = await Form.getFormById(req.params.id);
        if (!form) {
            return res.status(404).json({message: 'Form not found'});
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateForm = async (req, res) => {
    try {
        if (req.file) {
            const imageUrl = `/static/${req.file.filename ?? null}`;
            req.body.imageurl = imageUrl;
        } else req.body.imageurl = null;
        const form = await Form.updateForm(req.params.id, req.body);
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.deleteForm = async (req, res) => {
    try {
        const form = await Form.deleteForms(req.params.id);
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.changeActiveType = async (req, res) => {

    try {
        const data = await Form.changeActiveType(req.params.id, req.body.type);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({message: error.message});

    }
}
exports.changeApprovedType = async (req, res) => {
    try {
        const data = await Form.changeApprovedType(req.params.id, req.body.type);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({message: error.message});

    }
}

exports.sms = async (req, res) => {
    try {
 let number = '09190115918'
       const a = await sms.sendSMS(number)
        res.status(200).json(a);
    } catch (error) {
        res.status(400).json({message: error.message});

    }
}