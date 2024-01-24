const express = require('express');
const router = express.Router();
const PatientController = require('../../controllers/PatientController');
const ReferralController = require('../../controllers/ReferralController')
const upload = require('../../middlewares/multer')


router.post('/', upload.single('pdf'), ReferralController.createReferral);


module.exports = router;
