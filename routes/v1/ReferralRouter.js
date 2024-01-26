const express = require('express');
const router = express.Router();
const PatientController = require('../../controllers/PatientController');
const ReferralController = require('../../controllers/Referralcontroller')
const upload = require('../../middlewares/multer')

router.get('/', ReferralController.getAllReferrals);
router.post('/', upload.single('pdf'), ReferralController.createReferral);


module.exports = router;
