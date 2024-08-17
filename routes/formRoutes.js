const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const upload = require('../multer')
router.post('/forms', upload.single('imageurl'),formController.createForm);

router.get('/forms', formController.getForms);

router.get('/forms/:id', formController.getFormById);
router.put('/forms/:id', upload.single('imageurl'),formController.updateForm);

router.delete('/forms/:id', formController.deleteForm);

router.put('/forms/status/:id', formController.changeActiveType);

module.exports = router;
