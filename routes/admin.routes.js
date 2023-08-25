const express = require('express');

const adminController = require('../controllers/admin.controller');
const adminMiddleware = require('../middlewares/admin.middleware');
const validations = require('../middlewares/validations.middleware');

const router = express.Router();

router.post('/signup', validations.createAdmin, adminController.signup);
router.post('/login', validations.loginAdmin, adminController.login);
router.use(adminMiddleware.protect);
router.get('/generateQr', adminController.generateQRCode);

module.exports = router;
