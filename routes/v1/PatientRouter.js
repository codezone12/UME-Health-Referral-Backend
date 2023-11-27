const express = require('express');
const router = express.Router();
const PatientController = require('../../controllers/PatientController');
const upload = require('../../middlewares/multer')

router.get('/', PatientController.getAllPatients);
router.post('/', upload.single('pdf'), PatientController.createPatient);
router.get('/:id', PatientController.getPatientById);
router.patch('/:id', PatientController.updatePatient);
router.delete('/:id', PatientController.deletePatient);

module.exports = router;
