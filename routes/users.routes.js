const express = require('express');
const { upload } = require('../utils/multer');

const userMiddleware = require('../middlewares/user.middleware');
const userController = require('../controllers/user.controller');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router
  .route('/:qrId')
  .post(upload.single('petImg'), userController.create)
  .get(userController.findOne);

router.use(adminMiddleware.protect);
router.get('/', userController.findAll);
router.patch('/:id', userMiddleware.validExistId, userController.update);
router.delete('/:id', userMiddleware.validExistId, userController.delete);

module.exports = router;
