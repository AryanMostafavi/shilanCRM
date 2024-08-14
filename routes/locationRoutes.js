const express = require('express');
const locationController = require('../controllers/locationController')
const router = express.Router();

router.get('/provinces/:id', locationController.getCities);
router.get('/provinces/', locationController.getProvinces);


module.exports = router;
