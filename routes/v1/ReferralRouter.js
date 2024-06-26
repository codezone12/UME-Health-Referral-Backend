const express = require('express');
const router = express.Router();
const PatientController = require('../../controllers/PatientController');
const ReferralController = require('../../controllers/ReferralController')

const upload = require('../../middlewares/multer')

router.get('/', ReferralController.getAllReferrals);
router.get('/:id', ReferralController.getReferralById);
router.post('/update', ReferralController.referralUpdateRequest);
router.post('/', upload.single('pdf'), ReferralController.createReferral);
/* router.post('/:id', upload.single('pdf'), ReferralController.newReferral); */
router.patch('/:id', upload.single('pdf'), ReferralController.updateReferral);
router.patch('/date/:id', upload.single('pdf'), ReferralController.updateReferralbyAdmin);
router.patch('/report/:id', upload.single('finalReport'), ReferralController.uploadReportByAdmin);

router.delete('/:id', ReferralController.deleteReferral);


module.exports = router;
