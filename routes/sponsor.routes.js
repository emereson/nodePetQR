const express = require('express');

const sponsorController = require('../controllers/sponsor.controller');
const sponsorMiddleware = require('../middlewares/sponsor,middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const { upload } = require('../utils/multer');

const router = express.Router();

router.get(
  '/:id',
  sponsorMiddleware.validExistSponsor,
  sponsorController.findOne
);
router.get('/', sponsorController.findAll);

router.use(adminMiddleware.protect);
router.post('/', upload.single('sponsorImg'), sponsorController.create);

router
  .route('/:id')
  .patch(sponsorMiddleware.validExistSponsorPatch, sponsorController.update)
  .delete(sponsorMiddleware.validExistSponsor, sponsorController.delete);

module.exports = router;
