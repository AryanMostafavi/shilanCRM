const Form = require('../models/form');

exports.createForm = async (req, res) => {
    try {
        const imageUrl = `/static/${ req.file.filename ?? null}`
        req.body.imageUrl = imageUrl
        const form = await Form.createForm(req.body);
        res.status(201).json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getForms = async (req, res) => {
    try {
        const forms = await Form.getForms();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFormById = async (req, res) => {
    try {
        const form = await Form.getFormById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateForm = async (req, res) => {
    try {
        const form = await Form.updateForm(req.params.id, req.body);
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteForm = async (req, res) => {
    try {
        const form = await Form.deleteForms(req.params.id);
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
