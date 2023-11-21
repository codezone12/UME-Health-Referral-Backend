const express = require('express');
const router = express.Router();
const PatientController = require('../../controllers/PatientController');

router.get('/', PatientController.getAllPatients);
router.post('/', PatientController.createPatient);
router.get('/:id', PatientController.getPatientById);
router.patch('/:id', PatientController.updatePatient);
router.delete('/:id', PatientController.deletePatient);

module.exports = router;
