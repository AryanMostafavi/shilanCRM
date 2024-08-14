const location = require('../models/location')

exports.getProvinces = (req, res) => {
    try {
        const provinces = location.provinces()
        res.status(200).json(provinces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCities = (req, res) => {
    try {
        const cities =  location.cities(req.params.id)
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

